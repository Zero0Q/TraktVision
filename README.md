# TraktVision

TraktVision is a Stremio addon that integrates with Trakt to visually display your watching progress on content posters. It allows users to authenticate with their Trakt account and set a custom refresh rate for updating progress information, all while keeping sensitive data client-side.

## Features

- Secure authentication with Trakt (entirely client-side)
- Customizable refresh rate for progress updates
- Displays progress bar on content posters in Stremio
- No server-side storage of user data or Trakt credentials

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
5. The addon server receives only the data in the URL, with no direct Trakt integration

## Development

To run this addon locally:

1. Clone this repository
2. Install dependencies with `npm install`
3. Replace 'YOUR_TRAKT_CLIENT_ID' in config.html with your actual Trakt Client ID
   - You'll need to create a Trakt application at https://trakt.tv/oauth/applications
   - Set the redirect URI to the URL where your config.html will be hosted
4. Run the addon with `npm start`
5. Open config.html in your browser to configure and get the addon URL

## Configuration

The addon is configured entirely through the web interface (config.html). Users need to:

1. Authenticate with Trakt
2. Set the refresh rate (in minutes)
3. Use the generated URL to add the addon to Stremio

## Security Note

This addon uses client-side authentication and passes all necessary data through the URL. While this ensures no sensitive data is stored on the server, be cautious about sharing the generated URL, as it contains your Trakt watching data and access token.

## Limitations

- The addon relies on data fetched at configuration time. For updated progress, users need to regenerate the addon URL periodically.
- Large amounts of watching data might result in very long URLs.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
