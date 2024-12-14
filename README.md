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
