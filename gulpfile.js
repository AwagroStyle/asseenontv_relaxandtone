var gulp         = require('gulp'),
    sourcemaps   = require('gulp-sourcemaps'),
	sass         = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	concat       = require('gulp-concat'),
	uglify       = require('gulp-uglifyjs'),
	babel        = require('gulp-babel'),
	cssnano      = require('gulp-cssnano'),
	rename       = require('gulp-rename'),
	del          = require('del'),
	imagemin     = require('gulp-imagemin'),
	pngquant     = require('imagemin-pngquant'),
	cache        = require('gulp-cache'),
	gsmq         = require('gulp-group-css-media-queries'),
	injectPartials = require('gulp-inject-partials'),
	autoprefixer = require('gulp-autoprefixer');

gulp.task('index', function () {
	return gulp.src('./app/*.html')
		.pipe(injectPartials())
		.pipe(gulp.dest('./app'))
		.pipe(browserSync.reload({ stream: true }))
});

gulp.task('code', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('sass', function() {
	return gulp.src('app/scss/app.scss')
	    .pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(gsmq())
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(cssnano())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function() {
	return gulp.src([
		/** libs */
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/slick-carousel/slick/slick.min.js',
		/** custom */
		'app/js/app.js',
		])
		.pipe(babel({
            presets: ['@babel/env']
        }))
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('clean', async function() {
	return del.sync('dist');
});

gulp.task('img', function() {
	return gulp.src('app/img/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('prebuild', async function() {

	var buildCss = gulp.src('app/css/*')
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src('app/js/app.min.js')
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));

	var buildPhp = gulp.src('app/*.php')
	.pipe(gulp.dest('dist'));

});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('checkupdate', function() {
	gulp.watch('app/scss/**/*.scss', gulp.parallel('sass'));
	gulp.watch('app/*.html', gulp.parallel('code'));
	gulp.watch('app/partials/*.html', gulp.parallel('index'));
	gulp.watch(['app/js/app.js', 'app/libs/**/*.js'], gulp.parallel('scripts'));
});
gulp.task('watch', gulp.parallel('sass', 'scripts', 'browser-sync', 'index', 'checkupdate'));
gulp.task('build', gulp.series('clean', gulp.parallel('prebuild', 'img', 'sass', 'scripts', 'index',)));