# TraktVision

TraktVision is a Stremio addon that integrates with Trakt to visually display your watching progress on content posters. It allows users to authenticate with their Trakt account and set a custom refresh rate for updating progress information, while keeping sensitive data secure.

## Features

- Secure authentication with Trakt (client-side)
- Customizable refresh rate for progress updates
- Displays progress bar on content posters in Stremio
- Server-side processing of poster modifications
- No persistent storage of user data or Trakt credentials on the server
- Integration with TMDB (The Movie Database) for metadata

## Installation

1. Visit the TraktVision configuration page (hosted version of config.html)
2. Click "Login with Trakt" and authorize the application
3. Set your desired refresh rate for progress updates
4. Copy the generated addon URL
5. In Stremio, go to the addons section and paste the URL to install the addon

## How It Works

1. User authenticates with Trakt in their browser
2. The configuration page fetches the user's watching data from Trakt
3. A unique URL is generated containing the user's data and preferences
4. This URL is used to add the addon to Stremio
5. When Stremio requests content, it sends this URL to the addon server
6. The addon server processes the request:
   - Decodes the user data from the URL
   - Fetches current metadata from TMDB
   - Calculates the user's progress for the requested content
   - Modifies the poster to include a progress bar
   - Sends the modified poster back to Stremio
7. Stremio displays the personalized poster with the progress bar

## Server Role

The addon server plays a crucial role in processing requests and generating modified posters:

- It receives requests from Stremio, including the user's configuration
- It uses this configuration to calculate current progress for requested content
- It fetches metadata and original posters from TMDB
- It modifies the posters to include progress bars
- It sends these modified posters back to Stremio for display

The server does not store any user data persistently. Each request is processed independently using the configuration provided in the URL.

## Refresh Rate

The refresh rate set during configuration influences how often Stremio will request updated information from the addon. However, each request to the addon server will always fetch the most current data from TMDB and calculate up-to-date progress based on the user's Trakt data provided in the configuration.

## Development

To run this addon locally:

1. Clone this repository
2. Install dependencies with `npm install`
3. Replace 'YOUR_TRAKT_CLIENT_ID' in config.html with your actual Trakt Client ID
   - You'll need to create a Trakt application at https://trakt.tv/oauth/applications
   - Set the redirect URI to the URL where your config.html will be hosted
4. Obtain a TMDB API key from https://www.themoviedb.org/settings/api
5. Set your TMDB API key as an environment variable or in a config file (do not commit this to version control)
6. Run the addon with `npm start`
7. Open config.html in your browser to configure and get the addon URL

## Configuration

The addon is configured through the web interface (config.html). Users need to:

1. Authenticate with Trakt
2. Set the refresh rate (in minutes)
3. Use the generated URL to add the addon to Stremio

## Security Note

While this addon processes requests server-side, it's designed with privacy in mind:
- Authentication and initial data fetching occur client-side
- User data is passed through the URL and not stored on the server
- Each request is processed independently
- No persistent storage of user data or credentials on the server

However, be cautious about sharing the generated URL, as it contains your Trakt watching data and access token.

## Limitations

- The addon relies on data fetched at configuration time. For major updates in watching history, users may need to regenerate the addon URL.
- Very large amounts of watching data might result in long URLs.
- TMDB API usage is subject to their terms of service and rate limiting.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
