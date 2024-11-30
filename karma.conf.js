module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-jasmine-html-reporter'),
        require('karma-coverage'),
        require('@angular-devkit/build-angular/plugins/karma'),
      ],
      client: {
        clearContext: false, // Deja visible el resultado de las pruebas en la consola del navegador
      },
      coverageReporter: {
        dir: require('path').join(__dirname, './coverage/todo-list'),
        subdir: '.',
        reporters: [{ type: 'html' }, { type: 'text-summary' }],
      },
      reporters: ['progress', 'kjhtml', 'coverage'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['Chrome'],
      singleRun: false,
      restartOnFileChange: true,
    });
  };
  