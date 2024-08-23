docker build step:
`docker build -t ionic-capacitor github.com/robingenz/docker-ionic-capacitor`
`docker run --name capacitor-build-container -v .:/app -w /app ionic-capacitor bash -c "npm install && npm run build && npx cap sync android && ./android/gradlew assembleDebug"`
`docker cp capacitor-build-container:/app/android/app/build/outputs/apk/debug/app-debug.apk ./app-debug.apk`

bonus:

- refresh token on expiration: done
- prettier overall styles: done
- better projects styles(green/red for validated projects, star for 125% projects)
- show all cursus levels instead of a single one
- /about page

![search](./readme-assets/index.png)
![profile1](./readme-assets/profile1.png)
![profile2](./readme-assets/profile2.png)
