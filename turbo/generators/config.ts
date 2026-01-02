import { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("react-component", {
    description: "Generate a new React component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the component?",
        validate: (input: string) => {
          if (!input) {
            return "Component name is required";
          }
          if (input.includes(" ")) {
            return "Component name cannot include spaces";
          }
          if (!/^[A-Z]/.test(input)) {
            return "Component name must start with an uppercase letter";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "componentType",
        message: "What type of component do you want to create?",
        choices: [
          { name: "UI component only", value: "ui" },
          { name: "Template component only", value: "template" },
          { name: "Both (template implements UI)", value: "both" },
          { name: "Custom path component", value: "custom" },
        ],
        default: "ui",
      },
      {
        type: "confirm",
        name: "withTest",
        message: "Do you want to create a test file?",
        default: true,
      },
      {
        type: "input",
        name: "customPath",
        message: "Enter the custom path (relative to workspace root, e.g., 'apps/web/components'):",
        when: (answers) => answers.componentType === "custom",
        validate: (input: string) => {
          if (!input) {
            return "Custom path is required";
          }
          if (input.startsWith("/")) {
            return "Path should be relative (don't start with /)";
          }
          if (input.includes("{{ turbo.paths.root }}")) {
            return "Don't include {{ turbo.paths.root }} - path is already relative to root";
          }
          if (input.endsWith("/")) {
            return "Path should not end with a slash";
          }
          return true;
        },
        filter: (input: string) => input.replace(/\/$/, ""),
      },
    ],
    actions: (data) => {
      const actions: PlopTypes.ActionType[] = [];
      const componentType = data?.componentType;

      // UI Component
      if (componentType === "ui" || componentType === "both") {
        actions.push({
          type: "add",
          path: "{{ turbo.paths.root }}/packages/ui/src/{{ pascalCase name }}/{{ pascalCase name }}.tsx",
          templateFile: "templates/react-component/ui/component.hbs",
        });
        actions.push({
          type: "add",
          path: "{{ turbo.paths.root }}/packages/ui/src/{{ pascalCase name }}/index.ts",
          templateFile: "templates/react-component/shared/index.hbs",
        });
        actions.push({
          type: "add",
          path: "{{ turbo.paths.root }}/packages/ui/src/{{ pascalCase name }}/{{ pascalCase name }}.module.css",
          templateFile: "templates/react-component/ui/component.module.css.hbs",
        });
        actions.push({
          type: "add",
          path: "{{ turbo.paths.root }}/apps/docs/stories/ui/{{ pascalCase name }}.stories.tsx",
          templateFile: "templates/react-component/ui/component.stories.hbs",
        });

        if (data?.withTest) {
          actions.push({
            type: "add",
            path: "{{ turbo.paths.root }}/packages/ui/src/{{ pascalCase name }}/{{ pascalCase name }}.test.tsx",
            templateFile: "templates/react-component/ui/component.test.hbs",
          });
        }
      }
      // Template Component
      if (componentType === "template" || componentType === "both") {
        const templateFile =
          componentType === "both"
            ? "templates/react-component/template/template-with-ui.hbs"
            : "templates/react-component/template/template.hbs";

        actions.push({
          type: "add",
          path: "{{ turbo.paths.root }}/packages/templates/src/{{ pascalCase name }}/{{ pascalCase name }}.tsx",
          templateFile: templateFile,
        });
        actions.push({
          type: "add",
          path: "{{ turbo.paths.root }}/packages/templates/src/{{ pascalCase name }}/index.ts",
          templateFile: "templates/react-component/shared/index.hbs",
        });
        actions.push({
          type: "add",
          path: "{{ turbo.paths.root }}/packages/templates/src/{{ pascalCase name }}/{{ pascalCase name }}.module.css",
          templateFile: "templates/react-component/template/template.module.css.hbs",
        });
        actions.push({
          type: "add",
          path: "{{ turbo.paths.root }}/apps/docs/stories/templates/{{ pascalCase name }}.stories.tsx",
          templateFile:
            "templates/react-component/template/template.stories.hbs",
        });

        if (data?.withTest) {
          actions.push({
            type: "add",
            path: "{{ turbo.paths.root }}/packages/templates/src/{{ pascalCase name }}/{{ pascalCase name }}.test.tsx",
            templateFile:
              "templates/react-component/template/template.test.hbs",
          });
        }
      }

      // Custom Component
      if (componentType === "custom") {
        const basePath = `{{ turbo.paths.root }}/${data?.customPath}`;

        actions.push({
          type: "add",
          path: `${basePath}/{{ pascalCase name }}/{{ pascalCase name }}.tsx`,
          templateFile: "templates/react-component/ui/component.hbs",
        });
        actions.push({
          type: "add",
          path: `${basePath}/{{ pascalCase name }}/index.ts`,
          templateFile: "templates/react-component/shared/index.hbs",
        });
        actions.push({
          type: "add",
          path: `${basePath}/{{ pascalCase name }}/{{ pascalCase name }}.module.css`,
          templateFile: "templates/react-component/ui/component.module.css.hbs",
        });

        if (data?.withTest) {
          actions.push({
            type: "add",
            path: `${basePath}/{{ pascalCase name }}/{{ pascalCase name }}.test.tsx`,
            templateFile: "templates/react-component/ui/component.test.hbs",
          });
        }

        // No Storybook story for custom components
      }

      return actions;
    },
  });
}
