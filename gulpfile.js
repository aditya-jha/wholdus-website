var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var uglifycss = require('gulp-uglifycss');
var RevAll = require('gulp-rev-all');
var revReplace = require('gulp-rev-replace');
var gulpsync = require('gulp-sync')(gulp);
var exec = require('child_process').exec;

var jsVendors =  [
    'app/bower_components/angular/angular.min.js',
    'app/bower_components/angular-route/angular-route.min.js',
    'app/bower_components/angular-animate/angular-animate.min.js',
    'app/bower_components/angular-aria/angular-aria.min.js',
    'app/bower_components/angular-material/angular-material.min.js',
    'app/bower_components/angular-messages/angular-messages.min.js',
    'app/bower_components/ngprogress/build/ngprogress.min.js',
    'app/bower_components/angular-local-storage/dist/angular-local-storage.min.js',
];

var jsCustom = [
    'app/app.js',
    'app/scripts/services/constantKeyValueService.js',
    'app/scripts/services/apiService.js',
    'app/scripts/services/toastService.js',
    'app/scripts/services/utilService.js',
    'app/scripts/services/ngProgressbarService.js',
    'app/scripts/services/loginService.js',
    'app/scripts/services/orderService.js',
    'app/scripts/services/dialogService.js',
    'app/scripts/services/formValidationService.js',
    'app/scripts/directives/wuHeader.js',
    'app/scripts/directives/wuProduct.js',
    'app/scripts/directives/wuPagination.js',
    'app/scripts/directives/wuSidenav.js',
    'app/scripts/directives/imageOnLoad.js',
    'app/scripts/directives/wuScript.js',
    'app/scripts/directives/wuAccountSidenav.js',
    'app/scripts/directives/wuFeedDetail.js',
    'app/scripts/directives/wuGallery.js',
    'app/scripts/directives/wuFooter.js',
    'app/scripts/directives/wuStoreFooter.js',
    'app/scripts/controllers/homeController.js',
    'app/scripts/controllers/categoryController.js',
    'app/scripts/controllers/productController.js',
    'app/scripts/controllers/popupController.js',
    'app/scripts/controllers/staticPagesController.js',
    'app/scripts/controllers/ordersController.js',
    'app/scripts/controllers/profileController.js',
    'app/scripts/controllers/feedController.js',
    'app/scripts/controllers/blogController.js',
    'app/scripts/controllers/redirectController.js',
    'app/scripts/controllers/galleryPopupController.js',
    'app/scripts/controllers/lotPopupController.js',
    'app/scripts/controllers/consignmentController.js',
    'app/scripts/controllers/storeHomeController.js'
];

var stylesheets = [
    'app/bower_components/angular-material/angular-material.min.css',
    'app/styles/style.css',
    'app/styles/mediaQueries.css',
    'app/styles/animations.css',
];

gulp.task('copyViews', function() {
    return gulp.src('./app/views/**/*.html')
                .pipe(gulp.dest('./build/views'));
});

gulp.task('copyImages', function() {
    return gulp.src('./app/images/**/*.{png,jpg,svg,jpeg,ico}')
                .pipe(gulp.dest('./build/images'));
});

gulp.task('vendorScripts', function() {
    return gulp.src(jsVendors)
                .pipe(concat('vendor.js'))
                .pipe(gulp.dest('build/js'));
});

gulp.task('buildVendorScripts', function() {
    var revAll = new RevAll();
    return gulp.src(jsVendors)
                .pipe(concat('vendor.js'))
                .pipe(rename({suffix: '.min'}))
                .pipe(revAll.revision())
                .pipe(gulp.dest('build/js/vendor'))
                .pipe(revAll.manifestFile())
                .pipe(gulp.dest('build/js/vendor'))
                .pipe(revAll.versionFile())
                .pipe(gulp.dest('build/js/vendor'));
});

gulp.task('styles', function() {
    var revAll = new RevAll();
    return gulp.src(stylesheets)
                .pipe(concat('styles.css'))
                .pipe(rename({suffix: '.min'}))
                .pipe(uglifycss())
                .pipe(revAll.revision())
                .pipe(gulp.dest('build/css'))
                .pipe(revAll.manifestFile())
                .pipe(gulp.dest('build/css'))
                .pipe(revAll.versionFile())
                .pipe(gulp.dest('build/css'));
});

gulp.task('buildCustomScripts', function() {
    var revAll = new RevAll();
    return gulp.src(jsCustom)
                .pipe(concat('custom.js'))
                .pipe(rename({suffix: '.min'}))
                .pipe(uglify())
                .pipe(revAll.revision())
                .pipe(gulp.dest('build/js'))
                .pipe(revAll.manifestFile())
                .pipe(gulp.dest('build/js'))
                .pipe(revAll.versionFile())
                .pipe(gulp.dest('build/js'));
});

gulp.task('startServer', function() {
    exec('http-server ./build/', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

// Default Task
gulp.task('default', ['vendorScripts', 'styles']);

// production build
gulp.task('build', ['buildVendorScripts', 'styles', 'buildCustomScripts', 'copyViews', 'copyImages']);

// local production server
gulp.task('serve', ['startServer']);
