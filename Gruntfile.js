module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig({
        mochaTest: {
            api: {
                options: {
                    reporter: 'spec',
                    captureFile: 'results.txt',
                    quiet: false,
                    clearRequireCache: false
                },
                src: ['test/*.js']
            }
        },

        jshint: {
            all: ['index.js', 'config/**/*.js', 'routes/**/*.js', 'services/**/*.js', 'test/**/*.js']
        }
    });

    grunt.registerTask('test', ['jshint:all', 'mochaTest:api']);
    grunt.registerTask('lint', ['jshint:all']);
};
