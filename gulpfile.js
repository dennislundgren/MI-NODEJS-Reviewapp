const gulp = require("gulp");
const sass = require("gulp-sass");

gulp.task("compile-sass", function () {
  return gulp.src("scss/**/*.scss").pipe(sass()).pipe(gulp.dest("public/css"));
});

gulp.task("watch", function () {
  gulp.watch("scss/**/*.scss", gulp.series("compile-sass"));
});

gulp.task("default", gulp.series("compile-sass", "watch"), () => {});
