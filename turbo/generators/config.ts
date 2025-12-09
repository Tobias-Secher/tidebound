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
        ],
        default: "ui",
      },
      {
        type: "confirm",
        name: "withTest",
        message: "Do you want to create a test file?",
        default: true,
      },
    ],
    actions: (data) => {
      const actions: PlopTypes.ActionType[] = [];
      const componentType = data?.componentType;

      // UI Component
      if (componentType === "ui" || componentType === "both") {
        actions.push({
          type: "add",
          path: "{{ turbo.paths.root }}/packages/ui/src/{{ kebabCase name }}.tsx",
          templateFile: "templates/component.hbs",
        });
        actions.push({
          type: "add",
          path: "{{ turbo.paths.root }}/apps/docs/stories/ui/{{ pascalCase name }}.stories.tsx",
          templateFile: "templates/component.stories.hbs",
        });

        if (data?.withTest) {
          actions.push({
            type: "add",
            path: "{{ turbo.paths.root }}/packages/ui/src/{{ kebabCase name }}.test.tsx",
            templateFile: "templates/component.test.hbs",
          });
        }
      }

      // Template Component
      if (componentType === "template" || componentType === "both") {
        const templateFile =
          componentType === "both"
            ? "templates/template-with-ui.hbs"
            : "templates/template.hbs";

        actions.push({
          type: "add",
          path: "{{ turbo.paths.root }}/packages/templates/src/{{ kebabCase name }}.tsx",
          templateFile: templateFile,
        });
        actions.push({
          type: "add",
          path: "{{ turbo.paths.root }}/apps/docs/stories/templates/{{ pascalCase name }}.stories.tsx",
          templateFile: "templates/template.stories.hbs",
        });

        if (data?.withTest) {
          actions.push({
            type: "add",
            path: "{{ turbo.paths.root }}/packages/templates/src/{{ kebabCase name }}.test.tsx",
            templateFile: "templates/template.test.hbs",
          });
        }
      }

      return actions;
    },
  });

  plop.setGenerator("example", {
    description:
      "An example Turborepo generator - creates a new file at the root of the project",
    prompts: [
      {
        type: "input",
        name: "file",
        message: "What is the name of the new file to create?",
        validate: (input: string) => {
          if (input.includes(".")) {
            return "file name cannot include an extension";
          }
          if (input.includes(" ")) {
            return "file name cannot include spaces";
          }
          if (!input) {
            return "file name is required";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "type",
        message: "What type of file should be created?",
        choices: [".md", ".txt"],
      },
      {
        type: "input",
        name: "title",
        message: "What should be the title of the new file?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "{{ turbo.paths.root }}/{{ dashCase file }}{{ type }}",
        templateFile: "templates/turborepo-generators.hbs",
      },
    ],
  });
}
