var gulp 		 = 	require('gulp'),
	nano 	     = 	require('gulp-cssnano'),
	browserSync  = 	require('browser-sync'),
	concat 		 = require('gulp-concat'),
	uglify		 = require('gulp-uglify'),
	addSrc		 = require('gulp-add-src'),
	//imagemin 	 = require('gulp-imagemin'),
	less 		 = require('gulp-less'),
	//rename 		 = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer');

gulp.task("less", function() {
	return gulp.src([
			"./src/styles/main.less"
			])
		.pipe(less())
		.pipe(autoprefixer(['last 15 versions', 'ie 8', 'ie 7'], { cascade: true}))
		.pipe(nano())
		// .pipe(rename({suffix: 'min'})) - таким чином добавляється суфікс

		.pipe(gulp.dest("dist/css"))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task("bower-css", function() {
	return gulp.src([
			"src/bower/bootstrap/dist/css/bootstrap.css",
			"src/bower/toastr/toastr.min.css",
			"src/bower/components-font-awesome/css/font-awesome.min.css"
		])
	.pipe(sourcemaps.init()) //ініціалізація кроків
	.pipe(nano())
	.pipe(concat("bower.min.css"))
	.pipe(sourcemaps.write()) //запис карти
	.pipe(gulp.dest('dist/css'));
});

gulp.task("images", function() {
	return gulp.src("./src/images/**/*.{jpg,png}")
		.pipe(gulp.dest("dist/images"))
});

gulp.task("fonts", function() {
	return gulp.src([
		"src/bower/bootstrap/dist/fonts/*.*",
		"src/fonts/*",
        "src/bower/components-font-awesome/fonts/*.*"

	])
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task("html", function() {
	return gulp.src([
				"src/**/*.html"
	])
		.pipe(gulp.dest("dist"));
});

gulp.task('bower-js', function() {
	return gulp.src([
		"src/bower/bootstrap/dist/js/bootstrap.js",
		"src/bower/masonry/dist/masonry.pkgd.min.js",
		"src/bower/toastr/toastr.js"
	])
	.pipe(addSrc.prepend("src/bower/jquery/dist/jquery.js"))
	.pipe(concat('bower.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'));
});

gulp.task('main-js', function() {
	return gulp.src([
		"src/scripts/main.js"
	])
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'dist'
		},
		notify: false
	});
});

gulp.task('watch', ['browser-sync', 'less', 'main-js'], function() {
	gulp.watch('src/styles/**/*.less', ['less']);
	gulp.watch('src/*.html', ['html']);
	gulp.watch('dist/*.html', browserSync.reload);
	gulp.watch('src/scripts/*.js', ['main-js']);
	gulp.watch('dist/js/*.js', browserSync.reload);
});	

gulp.task('default', ['html', 'images', 'less', 'watch', 'bower-css', 'bower-js', 'fonts', 'main-js']);