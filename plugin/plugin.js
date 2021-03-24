const docsPluginExports = require("@docusaurus/plugin-content-docs");

const docsPlugin = docsPluginExports.default;

function docsPluginEnhanced(...pluginArgs) {
  const docsPluginInstance = docsPlugin(...pluginArgs);

  return {
    ...docsPluginInstance,

    async contentLoaded(...contentLoadedArgs) {

      // Create default plugin pages
      await docsPluginInstance.contentLoaded(...contentLoadedArgs);

      // Create your additional pages
      const { actions, content } = contentLoadedArgs[0];
      const { addRoute, createData } = actions;
      const { loadedVersions } = content;
      const createCalendarProp = async (version) => {
        const eventsPath = await createData(
          'events.json',
          JSON.stringify(contentLoadedArgs,null,2),
        );
        return eventsPath
  
  
      }

      await Promise.all(
        loadedVersions.map(async version => {
          addRoute({
            path: version.versionPath + "calendar",
            exact: true,
            component: "@site/src/components/calendar", // Your component
            modules: {
              // ... The props DocsCalendarPage need to receive
              calendar: await createCalendarProp(version)
            }
          });
        })
      );
    }
  };
}

module.exports = {
  ...docsPluginExports,
  default: docsPluginEnhanced
};