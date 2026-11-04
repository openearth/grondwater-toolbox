# Copilot instructions

## Commands

Run commands from the repository root. The project uses Yarn and recommends Node.js 12.11.0 (`.nvmrc`).

| Purpose | Command |
| --- | --- |
| Start the development server at `http://localhost:8080` | `yarn start` |
| Build for production | `yarn build` |
| Lint the project | `yarn lint` |
| Lint one file | `yarn lint src/path/to/file.vue` |
| Apply ESLint autofixes | `yarn format` |

There is no test script or test suite configured in this repository. Before starting the app, copy `.env.example` to `.env` and provide the Mapbox token and service URLs. With Node 17+, the legacy webpack build may need `NODE_OPTIONS=--openssl-legacy-provider` in the same terminal.

## Architecture

This is a Vue 2 single-page app using Vue Router, Vuex, Vuetify, and Mapbox GL. The router serves a shared three-step tool workflow; the active tool is selected by `/tools/:config`.

Tool definitions live in `public/data/<tool>.json`, and `public/data/available-configs.json` is the allowlist for tool routes. The router loads the selected definition through `src/repo/configRepo.js` and `src/store/modules/data`; the `app` Vuex module holds the active name, steps, and map definition. The JSON configuration names components and actions rather than importing them directly: `src/components/step-components.vue`, `src/components/step-actions/step-actions.vue`, and `src/components/tool-maps/tool-maps.vue` resolve those names through component registries. When adding a tool or a new configured component/action/map name, update the relevant allowlist and registry as well as the JSON definition.

Tool-specific Vuex modules coordinate calculations, while shared selections and map state live in `src/store/modules/selections` and `src/store/modules/mapbox`. Keep WPS/GeoServer request construction and response handling in `src/lib`; stores and components use those helpers, and calculation results flow through the shared mapbox state. The map uses GeoServer WMS layers for display and WCS for layer export. The shared waterways reference layer is above calculation/system layers and below drawing layers; it is not part of calculation exports or result opacity controls.

## Conventions

- Vue components use the Vue 2 Options API and single-file `.vue` components.
- Vuex modules are namespaced. Use their local actions/getters through `mapActions` and `mapGetters`; dispatch across modules with `{ root: true }`.
- Use the `@` alias for imports from `src`.
- Configured step components may be a component-name string or an object with `name` and `props`; preserve this shape when changing the config-driven renderer.
- Follow `.eslintrc.js`: single quotes and semicolons are errors; Vue script blocks use two-space indentation (in addition to the component indentation).


## Coding architecture

- Keep calculation logic in tool-specific Vuex modules; do not embed complex calculations in components.
- Use `src/lib` for request construction and response handling for WPS/GeoServer interactions.
- Components should primarily handle rendering and user interaction; delegate state management to Vuex.
- Shared map state should be managed through `src/store/modules/mapbox` to ensure consistent map behavior across tools.
- When adding new features, follow the existing pattern of separating configuration, state management, and rendering logic.
- Avoid directly manipulating the DOM outside of Vue's template and lifecycle methods; use Vue's reactivity system for state-driven updates.
- Keep utility functions and constants in separate modules under `src/lib` to promote reuse and maintainability.
- Ensure that all asynchronous operations, such as API requests, are properly handled with error handling and state updates in Vuex rather than directly in components.
- Maintain a clear separation between configuration, state management, and rendering logic to facilitate maintainability and scalability of the application.
- Document the purpose and usage of each Vuex module, component, and utility function to improve code readability and onboarding for new developers.
- Regularly review and refactor code to maintain consistency with the established architecture and coding conventions.
- Ensure that new code adheres to the project's coding standards and best practices, including proper use of Vuex, component structure, and utility modules.
- Avoid introducing tightly coupled code; strive for modularity and separation of concerns to enhance maintainability and testability.
- When modifying existing code, ensure that changes do not break the established architecture and follow the same patterns for consistency.
- Regularly communicate with the team to align on architectural decisions and coding practices, especially when introducing significant changes or new features.
- Whenever a new layer is introduced ensure to load it if possible from the raster-layer component. 
- Ensure to use the .env variables where possible for instance when the LAYER_URL or other configuration values are needed.
- Avoid hardcoding URLs or configuration values directly in the code; always prefer using environment variables for flexibility and security.


## Plan instructions
- When creating a plan, clearly define the objectives, scope, and expected outcomes.
- The plan should include all the proposed codebase changes, and demonstrate them to the developer.

