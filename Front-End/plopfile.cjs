module.exports = function (plop) {
  plop.setGenerator('component', {
    description: 'Gerar componente React TSX com CSS',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Nome do componente (PascalCase)',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.tsx',
        templateFile: 'plop-templates/Component.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.css',
        templateFile: 'plop-templates/Component.css.hbs',
      },
    ],
  });
};
