# Fable Factory
This is a website that helps people learn 134 different languages by creating stories for people in the language they are learning. Create fables via inputting a story idea, and the site will generate a story based around that idea. Users can share any story with a button press. Stories that have been shared will also appear publicly on https://fablefactory.co/library. Users can also translate any page into their native language by simply clicking the page, where the site will translate the page into the language the user's browser is in. Users can log also in to save the stories they generate.

- Deployed application link
https://fablefactory.co/
- Screenshots/GIFs/demo video of your application
![image](https://github.com/user-attachments/assets/a3722c38-3abc-4bdb-8cc8-f398f77d2bf5)

Video Demonstration: https://github.com/user-attachments/assets/a38f74a2-58b6-440e-af3d-fe0a00e00033

- Setup instructions for running locally
  - Replace the Firebase config object with a new project's config (found in /shared/firebaseConfig.ts). Make sure this project has the proper firebase services (firestore, functions, etc.) setup before running firebase init
  - Make a service key that has firebase admin privileges
  - Make a second service key that can access the google translate API in your project, and place it in /functions/translation-key.json
  - fill env variables in /functions/.env: OPENAI_API_KEY, OPENAI_ORGANIZATION_ID, GCP_PROJECT_ID, GCP_KEY_FILE_NAME (translation-key.json), PRODUCTION_MODE (PROD)
  - npm i
  - in one terminal, run `npm run emulators`
  - in a second terminal, after the emulators are completely on, run `npm run dev` 
- **Learning Journey**: A section describing:
    - What inspired you to create this project
      - I have been learning languages for years and it can get monotonous at times. For me, reading in my target language is the funnest part of language learning, but finding material to read is always difficult for me. So I decided to create a site that can make an infinite amount of learning material for me about whatever I wanted.
    - What potential impact do you believe it could have on its intended users or the broader community
      - I strongly believe that this can be a good aid for language learners. I have learned new vocabulary from this site and I want to work to improve it to make it even more effective.
    - What new technology you learned
      - SCSS
      - SendGrid
      - Google Translate API
    - Why you chose the new technology
      - I wanted to expand beyond TailwindCSS, which I have been using for years. I quite like TailwindCSS but I wanted to try out something more similar to regular CSS because Tailwind is quite different. I also wanted to expiriment with animations in SCSS because in Tailwind they can be quite annoying.
      - I chose to use the SendGrid API because I wanted to see what it would take to embed an email newsletter in a site
      - I added the Google Translate API because I felt that the project needed it. One of the biggest pain points when reading something in a langauage you're learning is having to translate something back to your native language when you don't understand it. By baking Google Translate into the site, it removes this pain point by making it as easy as clicking a button.
    - Challenges you faced, and what you learned from the experience
      - I faced problems with getting the LLM to behave, because sometimes users could get it to generate inappropriate stories with prompt engineering, so now I have it pass through the LLM a few times to ensure that everything is OK and that it is at the correct reading level. I learned a lot here about wrangling LLMs and teaching it to simultaneously not trust user input 100% while also listening to the wishes of the user.
      - I struggled a lot with getting the look and feel of the site to be right. I still think it could be improved, but it's come a long way and I'm proud of the 3D models that I made for the site as well as the color scheme. I learned about how to maintain a consistent style across a whole site, and how to pick colors that work well together
