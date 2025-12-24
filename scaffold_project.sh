#!/bin/bash
set -e

# Initialize Expo app
echo "Initializing Expo Project..."
if [ -f "package.json" ]; then
    echo "package.json already exists. Skipping create-expo-app."
else
    # Create in a temporary directory to avoid "non-empty directory" error
    npx create-expo-app@latest temp_app -y
    
    # Move files to current directory
    echo "Moving files from temp_app to current directory..."
    mv temp_app/* .
    mv temp_app/.* . 2>/dev/null || true # Move hidden files, ignore error if . or .. match
    rmdir temp_app
fi

# Install dependencies
echo "Installing Dependencies..."
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
npx expo install @supabase/supabase-js react-native-url-polyfill expo-secure-store
npx expo install react-native-youtube-iframe react-native-webview
npx expo install @react-native-async-storage/async-storage

# Create Directory Structure
echo "Creating Directory Structure..."
mkdir -p src/components
mkdir -p src/screens
mkdir -p src/lib
mkdir -p src/constants
mkdir -p src/hooks
mkdir -p src/context

# Setup Supabase Client (Placeholder)
echo "Creating Supabase Client..."
cat <<EOF > src/lib/supabase.ts
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
EOF

echo "Scaffolding Complete."
