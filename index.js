const { addonBuilder } = require('stremio-addon-sdk');
const express = require('express');
const sharp = require('sharp');
const fetch = require('node-fetch');
const path = require('path');

// At the top of the file, add:
const PORT = process.env.PORT || 3000;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function fetchTMDBMetadata(id, type) {
    const tmdbType = type === 'series' ? 'tv' : 'movie';
    const url = `https://api.themoviedb.org/3/${tmdbType}/${id}?api_key=${TMDB_API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        return {
            id: data.id,
            type: type,
            name: data.name || data.title,
            poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
            background: `https://image.tmdb.org/t/p/original${data.backdrop_path}`,
            description: data.overview,
            releaseInfo: data.first_air_date || data.release_date,
            imdbRating: data.vote_average,
            genres: data.genres.map(g => g.name),
            runtime: data.episode_run_time?.[0] || data.runtime,
            episodes: type === 'series' ? data.number_of_episodes : undefined,
            seasons: type === 'series' ? data.number_of_seasons : undefined,
        };
    } catch (error) {
        console.error('Error fetching TMDB metadata:', error);
        return null;
    }
}

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const addon = new addonBuilder({
    id: 'org.traktvision',
    version: '1.0.0',
    name: 'TraktVision',
    description: 'Visualize your Trakt watching progress on Cinemeta posters',
    resources: ['catalog', 'meta', 'stream'],
    types: ['movie', 'series'],
    catalogs: []
});

// Modify the parseUserData function
function parseUserData(config) {
    try {
        const { userData, refreshRate } = JSON.parse(Buffer.from(config, 'base64').toString());
        return { userData, refreshRate };
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
}

// Calculate progress for a show
function calculateShowProgress(show, watchedShows) {
    const watched = watchedShows.find(s => s.show.ids.trakt === show.ids.trakt);
    if (!watched) return 0;
    return watched.completed / show.aired_episodes;
}

// Calculate progress for a movie
function calculateMovieProgress(movie, watchedMovies) {
    const watched = watchedMovies.find(m => m.movie.ids.trakt === movie.ids.trakt);
    return watched ? watched.plays > 0 ? 1 : 0 : 0;
}

// Function to fetch metadata from Cinemeta
async function fetchCinemetaMetadata(id, type) {
    const cinemetaUrl = `https://v3-cinemeta.strem.io/meta/${type}/${id}.json`;
    try {
        const response = await fetch(cinemetaUrl);
        const data = await response.json();
        return data.meta;
    } catch (error) {
        console.error('Error fetching Cinemeta metadata:', error);
        return null;
    }
}

// Modify the defineMetaHandler function
addon.defineMetaHandler(async ({ id, type, config }) => {
    try {
        if (!config) throw new Error('No configuration provided');
        
        const { userData, refreshRate } = parseUserData(config);
        if (!userData) throw new Error('Invalid user data');
        
        const { watching, watched } = userData;
        
        // Try TMDB first
        let meta = await fetchTMDBMetadata(id, type);
        
        // If TMDB fails, fall back to Cinemeta
        if (!meta) {
            meta = await fetchCinemetaMetadata(id, type);
        }
        
        if (!meta) return { meta: null };

        // Calculate progress based on Trakt data
        let progress = 0;
        if (meta.type === 'series') {
            if (watching && watching.type === 'episode' && watching.show.ids.tmdb === id) {
                progress = watching.progress / 100;
            } else {
                const watchedShow = watched.find(s => s.show.ids.tmdb === id);
                if (watchedShow) {
                    progress = calculateShowProgress(watchedShow.show, watched);
                }
            }
        } else if (meta.type === 'movie') {
            progress = calculateMovieProgress(meta, watched);
        }

        meta.progress = progress;
        return { meta };
    } catch (error) {
        console.error('Error in meta handler:', error);
        return { meta: null };
    }
});

// Modify the defineResourceHandler function
addon.defineResourceHandler(async ({ id, type, config }) => {
    if (type !== 'poster') return null;
    
    const { userData, refreshRate } = parseUserData(config);
    if (!userData) return null;
    
    // Try TMDB first
    let meta = await fetchTMDBMetadata(id, type);
    
    // If TMDB fails, fall back to Cinemeta
    if (!meta) {
        meta = await fetchCinemetaMetadata(id, type);
    }
    
    if (!meta || !meta.poster) return null;

    // Calculate progress based on Trakt data
    let progress = 0;
    const { watching, watched } = userData;
    if (meta.type === 'series') {
        if (watching && watching.type === 'episode' && watching.show.ids.tmdb === id) {
            progress = watching.progress / 100;
        } else {
            const watchedShow = watched.find(s => s.show.ids.tmdb === id);
            if (watchedShow) {
                progress = calculateShowProgress(watchedShow.show, watched);
            }
        }
    } else if (meta.type === 'movie') {
        progress = calculateMovieProgress(meta, watched);
    }

    const posterWithProgress = await generatePosterWithProgress(meta.poster, progress);
    
    return { resource: posterWithProgress, contentType: 'image/jpeg' };
});

async function generatePosterWithProgress(posterUrl, progress) {
    const posterImage = await sharp(await fetch(posterUrl).then(res => res.buffer()));
    const { width, height } = await posterImage.metadata();
    
    const progressBar = Buffer.from(`
        <svg width="${width}" height="20">
            <rect width="${width * progress}" height="20" fill="green" />
        </svg>
    `);
    
    return posterImage
        .composite([{ input: progressBar, top: height - 20, left: 0 }])
        .jpeg()
        .toBuffer();
}

app.get('/manifest.json', (req, res) => {
    const { config } = req.query;
    res.json(addon.getManifest(config));
});

app.get('/:resource/:type/:id/:extra?.json', (req, res) => {
    const { resource, type, id } = req.params;
    const { config } = req.query;
    addon.get(resource, type, id, config).then(resp => res.json(resp));
});

// Replace hardcoded port with PORT variable
app.listen(PORT, () => {
    console.log(`Addon running on port ${PORT}`);
});

// Add this near the other app.get routes
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});
