let gulp = require('gulp');
let cleanCSS = require('gulp-clean-css');
gulp.task('minify-css', () => {
    return gulp.src([
        'modules/header/*.css',
        'modules/home/*.css',
        'modules/league/*.css',
        'modules/player/*.css',
        'modules/playersearch/*.css',
        'modules/tools/*.css',
        'modules/team/*.css',
        'css/style.css',
        'css/player_style.css',
    ])
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist'));
});
