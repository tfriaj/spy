'use strict';

const sass = require('gulp-sass')(require('sass'));
const gulp = require('gulp');
const gutil = require('gulp-util');
const jshint = require('gulp-jshint');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const fileinclude = require('gulp-file-include');
const autoprefixer = require('gulp-autoprefixer');
const bs = require('browser-sync').create();
const rimraf = require('rimraf');
const gm = require('gulp-gm');
const comments = require('gulp-header-comment');

var path = {
  src: {
    // source paths
    html: 'app/*.html',
    others: 'app/*.+(php|ico|png)',
    htminc: 'app/partials/**/*.htm',
    incdir: 'app/partials/',
    plugins: 'app/plugins/**/*.*',
    js: 'app/js/*.js',
    scss: 'app/scss/**/*.scss',
    images: 'app/images/**/*.+(png|jpg|gif|svg|webp)',
    doc: 'documentation/**/*.*',
    blur: 'app/images/**/*.+(jpg|webp)'
  },
  build: {
    // build paths
    dirDev: 'builds/development/',
    dirFree: 'builds/free/',
    dirPremium: 'builds/premium/',
    dirNetlify: 'builds/netlify/'
  }
};

var template = {
  version: {
    free: 'free',
    premium: 'premium',
    netlify: 'netlify'
  }
};

/* =====================================================
Development Builds
===================================================== */

// Clean Build Folder
gulp.task('clean', function (cb) {
  rimraf('./builds', cb);
});

// HTML
gulp.task('html:build', function () {
  return gulp.src(path.src.html)
    .pipe(customPlumber('Error Running html-include'))
    .pipe(fileinclude({
      basepath: path.src.incdir,
      context: {
        version: template.version.premium
      }
    }))
    .pipe(gulp.dest(path.build.dirDev))
    .pipe(bs.reload({
      stream: true
    }));
});

// SCSS
gulp.task('scss:build', function () {
  return gulp.src(path.src.scss)
    .pipe(customPlumber('Error Running Sass'))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('/maps'))
    .pipe(gulp.dest(path.build.dirDev + 'css/'))
    .pipe(bs.reload({
      stream: true
    }));
});

// Javascript
gulp.task('js:build', function () {
  return gulp.src(path.src.js)
    .pipe(customPlumber('Error Running JS'))
    .pipe(jshint('./.jshintrc'))
    .pipe(notify(function (file) {
      if (!file.jshint.success) {
        return file.relative + " (" + file.jshint.results.length + " errors)\n";
      }
    }))
    .pipe(jshint.reporter('jshint-stylish'))
    .on('error', gutil.log)
    .pipe(gulp.dest(path.build.dirDev + 'js/'))
    .pipe(bs.reload({
      stream: true
    }));
});

// Images
gulp.task('images:build', function () {
  return gulp.src(path.src.images)
    .pipe(gulp.dest(path.build.dirDev + 'images/'))
    .pipe(bs.reload({
      stream: true
    }));
});

// Plugins
gulp.task('plugins:build', function () {
  return gulp.src(path.src.plugins)
    .pipe(gulp.dest(path.build.dirDev + 'plugins/'))
    .pipe(bs.reload({
      stream: true
    }));
});

// Other files like favicon, php, apple-icon on root directory
gulp.task('others:build', function () {
  return gulp.src(path.src.others)
    .pipe(gulp.dest(path.build.dirDev))
});

// Error Message Show
function customPlumber(errTitle) {
  return plumber({
    errorHandler: notify.onError({
      // Customizing error title
      title: errTitle || "Error running Gulp",
      message: "Error: <%= error.message %>",
      sound: "Glass"
    })
  });
}

// Watch Task
gulp.task('watch:build', function () {
  gulp.watch(path.src.html, gulp.series('html:build'));
  gulp.watch(path.src.htminc, gulp.series('html:build'));
  gulp.watch(path.src.scss, gulp.series('scss:build'));
  gulp.watch(path.src.js, gulp.series('js:build'));
  gulp.watch(path.src.images, gulp.series('images:build'));
  gulp.watch(path.src.plugins, gulp.series('plugins:build'));
});

// Build Task
gulp.task('default', gulp.series(
  'clean',
  'html:build',
  'js:build',
  'scss:build',
  'images:build',
  'plugins:build',
  'others:build',
  gulp.parallel(
    'watch:build',
    function () {
      bs.init({
        server: {
          baseDir: path.build.dirDev,
        }
      });
    })
  )
);



/* =====================================================
Free Builds
===================================================== */
// HTML
gulp.task('html:free:build', function () {
  return gulp.src(path.src.html)
    .pipe(customPlumber('Error Running html-include'))
    .pipe(fileinclude({
      basepath: path.src.incdir,
      context: {
        version: template.version.free
      }
    }))
    .pipe(comments(`
    WEBSITE: https://themefisher.com
    TWITTER: https://twitter.com/themefisher
    FACEBOOK: https://www.facebook.com/themefisher
    GITHUB: https://github.com/themefisher/
    `))
    .pipe(gulp.dest(path.build.dirFree));
});

// SCSS
gulp.task('scss:free:build', function () {
  return gulp.src(path.src.scss)
    .pipe(customPlumber('Error Running Sass'))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(comments(`
    WEBSITE: https://themefisher.com
    TWITTER: https://twitter.com/themefisher
    FACEBOOK: https://www.facebook.com/themefisher
    GITHUB: https://github.com/themefisher/
    `))
    .pipe(sourcemaps.write('/maps'))
    .pipe(gulp.dest(path.build.dirFree + 'css/'));
});

// Javascript
gulp.task('js:free:build', function () {
  return gulp.src(path.src.js)
    .pipe(customPlumber('Error Running JS'))
    .pipe(jshint('./.jshintrc'))
    .pipe(notify(function (file) {
      if (!file.jshint.success) {
        return file.relative + " (" + file.jshint.results.length + " errors)\n";
      }
    }))
    .pipe(jshint.reporter('jshint-stylish'))
    .on('error', gutil.log)
    .pipe(comments(`
    WEBSITE: https://themefisher.com
    TWITTER: https://twitter.com/themefisher
    FACEBOOK: https://www.facebook.com/themefisher
    GITHUB: https://github.com/themefisher/
    `))
    .pipe(gulp.dest(path.build.dirFree + 'js/'));
});

// Images
gulp.task('images-blur:free:build', function () {
  return gulp.src(path.src.blur)
    .pipe(gm(function (gmfile) {
      return gmfile.blur(30, 30);
    }))
    .pipe(gulp.dest(path.build.dirFree + 'images/'))
});

gulp.task('images:free:build', function () {
  return gulp.src(path.src.images)
    .pipe(gulp.dest(path.build.dirFree + 'images/'));
});

// Plugins
gulp.task('plugins:free:build', function () {
  return gulp.src(path.src.plugins)
    .pipe(gulp.dest(path.build.dirFree + 'plugins/'))
});

// Other files like favicon, php, apple-icon on root directory
gulp.task('others:free:build', function () {
  return gulp.src(path.src.others)
    .pipe(gulp.dest(path.build.dirFree))
});

// Build Task
gulp.task('free', gulp.series(
  'html:free:build',
  'js:free:build',
  'scss:free:build',
  'images:free:build',
  'images-blur:free:build',
  'plugins:free:build'
));


/* =====================================================
Premium Builds
===================================================== */

// HTML
gulp.task('html:premium:build', function () {
  return gulp.src(path.src.html)
    .pipe(customPlumber('Error Running html-include'))
    .pipe(fileinclude({
      basepath: path.src.incdir,
      context: {
        version: template.version.premium
      }
    }))
    .pipe(comments(`
    WEBSITE: https://themefisher.com
    TWITTER: https://twitter.com/themefisher
    FACEBOOK: https://www.facebook.com/themefisher
    GITHUB: https://github.com/themefisher/
    `))
    .pipe(gulp.dest(path.build.dirPremium));
});

// SCSS
gulp.task('scss:premium:build', function () {
  return gulp.src(path.src.scss)
    .pipe(customPlumber('Error Running Sass'))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('/maps'))
    .pipe(comments(`
    WEBSITE: https://themefisher.com
    TWITTER: https://twitter.com/themefisher
    FACEBOOK: https://www.facebook.com/themefisher
    GITHUB: https://github.com/themefisher/
    `))
    .pipe(gulp.dest(path.build.dirPremium + 'css/'));
});

gulp.task('scss-files:build', function () {
  return gulp.src(path.src.scss)
    .pipe(gulp.dest(path.build.dirPremium + 'scss/'))
});

// Javascript
gulp.task('js:premium:build', function () {
  return gulp.src(path.src.js)
    .pipe(customPlumber('Error Running JS'))
    .pipe(jshint('./.jshintrc'))
    .pipe(notify(function (file) {
      if (!file.jshint.success) {
        return file.relative + " (" + file.jshint.results.length + " errors)\n";
      }
    }))
    .pipe(jshint.reporter('jshint-stylish'))
    .on('error', gutil.log)
    .pipe(comments(`
    WEBSITE: https://themefisher.com
    TWITTER: https://twitter.com/themefisher
    FACEBOOK: https://www.facebook.com/themefisher
    GITHUB: https://github.com/themefisher/
    `))
    .pipe(gulp.dest(path.build.dirPremium + 'js/'));
});

// Images
gulp.task('images-blur:premium:build', function () {
  return gulp.src(path.src.blur)
    .pipe(gm(function (gmfile) {
      return gmfile.blur(10, 10);
    }))
    .pipe(gulp.dest(path.build.dirPremium + 'images/'))
});

gulp.task('images:premium:build', function () {
  return gulp.src(path.src.images)
    .pipe(gulp.dest(path.build.dirPremium + 'images/'));
});

// Plugins
gulp.task('plugins:premium:build', function () {
  return gulp.src(path.src.plugins)
    .pipe(gulp.dest(path.build.dirPremium + 'plugins/'))
});

// Other files like favicon, php, apple-icon on root directory
gulp.task('others:premium:build', function () {
  return gulp.src(path.src.others)
    .pipe(gulp.dest(path.build.dirPremium))
});

// Build Task
gulp.task('premium', gulp.series(
  'html:premium:build',
  'js:premium:build',
  'scss:premium:build',
  'scss-files:build',
  'images:premium:build',
  'images-blur:premium:build',
  'plugins:premium:build',
  'others:premium:build'
));


/* =====================================================
Netlify Builds
===================================================== */
// HTML
gulp.task('html:netlify:build', function () {
  return gulp.src(path.src.html)
    .pipe(customPlumber('Error Running html-include'))
    .pipe(fileinclude({
      basepath: path.src.incdir,
      context: {
        version: template.version.netlify
      }
    }))
    .pipe(gulp.dest(path.build.dirNetlify));
});

// SCSS
gulp.task('scss:netlify:build', function () {
  return gulp.src(path.src.scss)
    .pipe(customPlumber('Error Running Sass'))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('/maps'))
    .pipe(gulp.dest(path.build.dirNetlify + 'css/'));
});

// Javascript
gulp.task('js:netlify:build', function () {
  return gulp.src(path.src.js)
    .pipe(customPlumber('Error Running JS'))
    .pipe(jshint('./.jshintrc'))
    .pipe(notify(function (file) {
      if (!file.jshint.success) {
        return file.relative + " (" + file.jshint.results.length + " errors)\n";
      }
    }))
    .pipe(jshint.reporter('jshint-stylish'))
    .on('error', gutil.log)
    .pipe(gulp.dest(path.build.dirNetlify + 'js/'));
});

// Images
gulp.task('images:netlify:build', function () {
  return gulp.src(path.src.images)
    .pipe(gulp.dest(path.build.dirNetlify + 'images/'));
});

// Plugins
gulp.task('plugins:netlify:build', function () {
  return gulp.src(path.src.plugins)
    .pipe(gulp.dest(path.build.dirNetlify + 'plugins/'))
});

// Other files like favicon, php, apple-icon on root directory
gulp.task('others:netlify:build', function () {
  return gulp.src(path.src.others)
    .pipe(gulp.dest(path.build.dirNetlify))
});

// Build Task
gulp.task('netlify', gulp.series(
  'html:netlify:build',
  'js:netlify:build',
  'scss:netlify:build',
  'images:netlify:build',
  'plugins:netlify:build'
));