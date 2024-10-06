# TraktVision

TraktVision is an addon that integrates with Trakt to visually display your watching progress on content posters. It allows users to authenticate with their Trakt account and set a custom refresh rate for updating progress information.

## Features

- Secure authentication with Trakt
- Customizable refresh rate for progress updates
- Displays progress bar on content posters

## Installation

1. Visit the addon configuration page
2. Click "Login with Trakt" and authorize the application
3. Set your desired refresh rate
4. Copy the generated addon URL
5. Use the URL to install the addon in your preferred media center application

## Development

To run this addon locally:

1. Clone this repository
2. Install dependencies with `npm install`
3. Set your Trakt API credentials as environment variables:
   ```
   export TRAKT_CLIENT_ID=your_client_id
   export TRAKT_CLIENT_SECRET=your_client_secret
   ```
4. Run the addon with `npm start`

## Configuration

The addon can be configured through the web interface. Users need to:

1. Authenticate with Trakt
2. Set the refresh rate (in minutes)

## License

This project is licensed under the MIT License.
