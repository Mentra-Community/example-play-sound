import { AppServer, AppSession, ViewType } from '@mentra/sdk';


const PACKAGE_NAME = process.env.PACKAGE_NAME ?? (() => { throw new Error('PACKAGE_NAME is not set in .env file'); })();
const MENTRAOS_API_KEY = process.env.MENTRAOS_API_KEY ?? (() => { throw new Error('MENTRAOS_API_KEY is not set in .env file'); })();
const PORT = parseInt(process.env.PORT || '3000');

class ExampleMentraOSApp extends AppServer {

  constructor() {
    super({
      packageName: PACKAGE_NAME,
      apiKey: MENTRAOS_API_KEY,
      port: PORT,
    });
  }



  protected async onSession(session: AppSession, sessionId: string, userId: string): Promise<void> {
    // Show welcome message
    await session.audio.speak("Testing one");
    await session.audio.speak("Testing two");
    await session.audio.speak("Testing three");
    await session.audio.speak("Testing four");
    await session.audio.speak("Testing five.  stop");

    session.layouts.showTextWall("Ready to listen.  Say something and I'll repeat it back to you.");

    // Handle real-time transcription
    // requires microphone permission to be set in the developer console
    session.events.onTranscription(async (data) => {
      if (data.text.toLowerCase().includes("stop")) {
        await session.audio.stopAudio();
        this.logger.info("Stopping audio");
      } else if (data.isFinal && !(data.text.toLowerCase().includes("cool") || data.text.toLowerCase().includes("you said")) || data.text.toLowerCase().includes("stop")) {
        const response = await session.audio.speak("You said: " + data.text)
        this.logger.info("Response:" + response);
        if (response.success) {
          await session.audio.playAudio({ audioUrl: "https://okgodoit.com/cool.mp3" })
        } else if (response.error) {
          this.logger.error("Error playing audio: " + response.error);
        }
      }
    })
  }
}

// Start the server
// DEV CONSOLE URL: https://console.mentra.glass/
// Get your webhook URL from ngrok (or whatever public URL you have)
const app = new ExampleMentraOSApp();

app.start().catch(console.error);