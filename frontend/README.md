# Frontend
## Technologies Used

- [Vite](https://vitejs.dev/guide/)
- [HeroUI](https://heroui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org)
- [Framer Motion](https://www.framer.com/motion)
-  [Auth0 JWT](github.com/auth0s)

## Development
Development: `pnpm run dev`
Build: `pnpm run build`

When running dev locally in your machine, we need to adjust the `useAccessToken` hook. Only verifiable first-party applications (i.e., never localhost) may skip consent, so comment out the error and uncomment the `loginWithPopup` function. See [useAccessToken.ts](https://github.com/JerryJTJ/civboards/blob/master/frontend/src/api/useAccessToken.ts) for more details.
  

## License
This webapp was bootstrapped with [Vite and HeroUI (v2)](https://githubbox.com/frontio-ai/vite-template). Licensed under the [MIT license](https://github.com/frontio-ai/vite-template/blob/main/LICENSE).
