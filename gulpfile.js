const { src, dest, series, watch } = require(`gulp`),
    gulp = require(`gulp`),
    del = require(`del`),
    babel = require(`gulp-babel`),
    htmlCompressor = require(`gulp-htmlmin`),
    htmlValidator = require(`gulp-html`),
    cssCompressor = require(`gulp-uglifycss`),
    imageMin = require(`gulp-imagemin`),
    jsLinter = require(`gulp-eslint`),
    cssLinter = require(`gulp-stylelint`),
    jsCompressor = require(`gulp-uglify`),
    browserSync = require(`browser-sync`),
    reload = browserSync.reload;

let browserChoice = `default`;

async function safari () {
    browserChoice = `safari`;
}

async function firefox () {
    browserChoice = `firefox`;
}

async function chrome () {
    browserChoice = `google chrome`;
}

async function opera () {
    browserChoice = `opera`;
}

async function edge () {
    browserChoice = `microsoft edge`, `microsoft-edge`;
}

async function allBrowsers () {
    browserChoice = [
        `safari`,
        `firefox`,
        `google chrome`,
        `opera`,
        `microsoft-edge`
    ];
}

let validateHTML = () => {
    return gulp.src(
        `*.html`)
        .pipe(htmlValidator());
};

let compressHTML = () => {
    return src([`*.html`])
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod`));
};

let compressCSS = () => {
    return src([`css/*.css`,`css/**/*.css`])
        .pipe(cssCompressor())
        .pipe(dest(`prod/css`));
};

let transpileJSForDev = () => {
    return src(`js/*.js`)
        .pipe(babel())
        .pipe(dest(`temp/js`));
};

let transpileJSForProd = () => {
    return src(`js/*.js`)
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(dest(`prod/js`));
};

let minifyImage = () => {
    return src([`img/*.png, img/*.svg`, `img/*`])
        .pipe(imageMin({
            optipng: [`-i 1`, `-strip all`, `-fix`, `-o7`, `-force`],
            pngquant: [`--speed=1`, `--force`, 256],
            zopflipng: [`-y`, `--lossy_8bit`, `--lossy_transparent`],
            jpegRecompress: [`--strip`, `--quality`, `medium`, `--min`, 40, `--max`, 80],
            mozjpeg: [`-optimize`, `-progressive`],
            gifsicle: [`--optimize`],
            svgo: [`--enable`, `cleanupIDs`, `--disable`, `convertColors`],
            quiet: false
        }))
        .pipe(dest(`prod/img`));
};

let lintCSS = () => {
    return src(`css/*.css`)
        .pipe(cssLinter({
            failAfterError: false,
            reporters: [
                {formatter: `string`, console: true}
            ]
        }));
};

let lintJS = () => {
    return src(`js/*.js`)
        .pipe(jsLinter())
        .pipe(jsLinter.formatEach());
};

let serve = () => {
    browserSync({
        notify: true,
        port: 9000,
        reloadDelay: 50,
        browser: browserChoice,
        server: {
            baseDir: [
                `css`,
                `js`,
                `./`
            ]
        }
    });

    watch(`js/*.js`,
        series(lintJS, transpileJSForDev)
    ).on(`change`, reload);

    watch(`css/*.css`,
        series(lintCSS)
    ).on(`change`, reload);

    watch(`*.html`,
        series(validateHTML)
    ).on(`change`, reload);
};

async function clean() {
    let fs = require(`fs`),
        i,
        foldersToDelete = [`./temp`, `prod`];

    for (i = 0; i < foldersToDelete.length; i++) {
        try {
            fs.accessSync(foldersToDelete[i], fs.F_OK);
            process.stdout.write(`\n\tThe ` + foldersToDelete[i] +
                ` directory was found and will be deleted.\n`);
            del(foldersToDelete[i]);
        } catch (e) {
            process.stdout.write(`\n\tThe ` + foldersToDelete[i] +
                ` directory does NOT exist or is NOT accessible.\n`);
        }
    }

    process.stdout.write(`\n`);
}

async function listTasks () {
    let exec = require(`child_process`).exec;

    exec(`gulp --tasks`, function (error, stdout, stderr) {
        if (null !== error) {
            process.stdout.write(`An error was likely generated when invoking ` +
                `the “exec” program in the default task.`);
        }

        if (`` !== stderr) {
            process.stdout.write(`Content has been written to the stderr stream ` +
                `when invoking the “exec” program in the default task.`);
        }

        process.stdout.write(`\n\tThis default task does ` +
            `nothing but generate this message. The ` +
            `available tasks are:\n\n${stdout}`);
    });
}

exports.safari = series(safari, serve);
exports.firefox = series(firefox, serve);
exports.chrome = series(chrome, serve);
exports.opera = series(opera, serve);
exports.edge = series(edge, serve);
exports.safari = series(safari, serve);
exports.allBrowsers = series(allBrowsers, serve);
exports.validateHTML = validateHTML;
exports.compressHTML = compressHTML;
exports.transpileJSForDev = transpileJSForDev;
exports.transpileJSForProd = transpileJSForProd;
exports.minifyImage = minifyImage;
// exports.copyUnprocessedAssets = copyUnprocessedAssets;
exports.compressCSS = compressCSS;
exports.lintJS = lintJS;
exports.lintCSS = lintCSS;
exports.listTasks = listTasks;
exports.serve = series(
    validateHTML,
    lintCSS,
    lintJS,
    transpileJSForDev,
    serve
);
exports.build = series(
    compressHTML,
    compressCSS,
    transpileJSForProd,
    minifyImage
);
exports.clean = clean;
