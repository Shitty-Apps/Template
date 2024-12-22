# Update configuration.ts file
ad ids should be updated according to app

# Search for '@' and replace AppName and AppDescription
@AppName@
@AppDescription@

# Replace app-name in package.json
app-name

# Replace appname in build.gradle, MainActivity.java, strings.xml, capacitor.config.js,

# Serve the app in browser for development
ionic serve

# Generate Android build files
ionic cap add android

# Generate IOS build files
ionic cap add ios

# Copy web assets to native platform(s)
ionic cap copy

# Sync native platform(s) with web project and copy updates
ionic cap sync android

# Sync native platform(s) with web project and copy updates
ionic cap sync ios

# Open Android Studio
ionic cap open android

# Live reload for Android development
ionic cap run android -l --external
