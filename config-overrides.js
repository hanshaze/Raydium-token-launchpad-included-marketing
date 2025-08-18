const webpack = require("webpack");

module.exports = function override(config, env) {
    config.resolve.fallback = {
        url: require.resolve("url"),
        fs: false,
        // path: false,
        // os: false,
        assert: require.resolve("assert"),
        crypto: require.resolve("crypto-browserify"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        os: require.resolve("os-browserify/browser"),
        buffer: require.resolve("buffer"),
        stream: require.resolve("stream-browserify"),
        path: require.resolve("path-browserify"),
        vm: require.resolve("vm-browserify"),
    };

    config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"];

    config.plugins.push(
        new webpack.ProvidePlugin({
            process: "process/browser.js",
            Buffer: ["buffer", "Buffer"],
        })
    );

    // This is deprecated in webpack 5 but alias false does not seem to work
    config.module.rules.push({
        test: /node_modules[\\\/]https-proxy-agent[\\\/]/,
        use: "null-loader",
    });

    return config;
};
