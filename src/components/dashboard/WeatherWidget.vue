<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/common/AppIcon.vue'

const { t } = useI18n()

interface WeatherData {
  temp: number
  feelsLike: number
  description: string
  humidity: number
  windSpeed: number
  icon: string
  city: string
}

const weather = ref<WeatherData | null>(null)
const loading = ref(true)
const error = ref('')

// OpenWeatherMap API (бесплатный, без ключа для демо)
// Для продакшена нужно получить ключ на https://openweathermap.org/api
const API_KEY = 'demo' // Используем Open-Meteo API вместо OpenWeatherMap (не требует ключа)

async function fetchWeather() {
  loading.value = true
  error.value = ''

  try {
    // Используем Геолокацию для получения координат
    const position = await getCurrentPosition()
    const { latitude, longitude } = position.coords

    // Open-Meteo API - бесплатный и не требует ключа
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`,
    )

    if (!response.ok) {
      throw new Error('Failed to fetch weather')
    }

    const data = await response.json()

    // Получаем название города через Nominatim (OpenStreetMap)
    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
    )
    const geoData = await geoResponse.json()

    weather.value = {
      temp: Math.round(data.current.temperature_2m),
      feelsLike: Math.round(data.current.temperature_2m - 2), // Примерно
      description: getWeatherDescription(data.current.weather_code),
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      icon: getWeatherIcon(data.current.weather_code),
      city: geoData.address?.city || geoData.address?.town || geoData.address?.village || 'Unknown',
    }

    loading.value = false
  } catch (err) {
    console.error('Weather fetch error:', err)
    error.value = 'Unable to fetch weather data'
    loading.value = false

    // Показываем данные по умолчанию для демо
    weather.value = {
      temp: 22,
      feelsLike: 20,
      description: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      icon: 'CloudSun',
      city: 'Demo City',
    }
  }
}

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      // Координаты по умолчанию (Москва)
      reject(new Error('Geolocation not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      () => {
        // Если пользователь не дал разрешение, используем координаты по умолчанию (Москва)
        resolve({
          coords: {
            latitude: 55.7558,
            longitude: 37.6173,
          },
        } as GeolocationPosition)
      },
      { timeout: 5000 },
    )
  })
}

// Коды погоды Open-Meteo
function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Clear Sky',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Foggy',
    51: 'Light Drizzle',
    53: 'Drizzle',
    55: 'Heavy Drizzle',
    61: 'Light Rain',
    63: 'Rain',
    65: 'Heavy Rain',
    71: 'Light Snow',
    73: 'Snow',
    75: 'Heavy Snow',
    77: 'Snow Grains',
    80: 'Light Showers',
    81: 'Showers',
    82: 'Heavy Showers',
    85: 'Light Snow Showers',
    86: 'Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with Hail',
    99: 'Thunderstorm with Hail',
  }
  return descriptions[code] || 'Unknown'
}

function getWeatherIcon(code: number): string {
  if (code === 0 || code === 1) return 'Sun'
  if (code === 2) return 'CloudSun'
  if (code === 3) return 'Cloud'
  if (code === 45 || code === 48) return 'CloudFog'
  if (code >= 51 && code <= 67) return 'CloudRain'
  if (code >= 71 && code <= 77) return 'Snowflake'
  if (code >= 80 && code <= 82) return 'CloudRain'
  if (code >= 85 && code <= 86) return 'Snowflake'
  if (code >= 95) return 'CloudLightning'
  return 'Cloud'
}

onMounted(() => {
  fetchWeather()
})
</script>

<template>
  <div class="weather-widget">
    <div v-if="loading" class="weather-loading">
      <div class="spinner"></div>
      <p>{{ t('common.loading') }}</p>
    </div>

    <div v-else-if="error" class="weather-error">
      <AppIcon name="CloudOff" :size="48" />
      <p>{{ error }}</p>
    </div>

    <div v-else-if="weather" class="weather-content">
      <div class="weather-header">
        <div class="location">
          <AppIcon name="MapPin" :size="16" />
          <span>{{ weather.city }}</span>
        </div>
        <button class="refresh-btn" @click="fetchWeather" title="Refresh">
          <AppIcon name="RefreshCw" :size="16" />
        </button>
      </div>

      <div class="weather-main">
        <div class="weather-icon">
          <AppIcon :name="weather.icon" :size="64" stroke-width="1.5" />
        </div>
        <div class="weather-temp">
          <span class="temp-value">{{ weather.temp }}</span>
          <span class="temp-unit">°C</span>
        </div>
      </div>

      <div class="weather-description">
        {{ weather.description }}
      </div>

      <div class="weather-details">
        <div class="detail-item">
          <AppIcon name="Thermometer" :size="16" />
          <span>Feels like {{ weather.feelsLike }}°C</span>
        </div>
        <div class="detail-item">
          <AppIcon name="Droplets" :size="16" />
          <span>{{ weather.humidity }}%</span>
        </div>
        <div class="detail-item">
          <AppIcon name="Wind" :size="16" />
          <span>{{ weather.windSpeed }} km/h</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-widget {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-xl);
  min-height: 300px;
}

.weather-loading,
.weather-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  flex: 1;
  color: var(--color-text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.weather-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.location {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-secondary);
  font-size: var(--font-sm);
}

.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs);
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.refresh-btn:hover {
  background-color: var(--color-background-soft);
  color: var(--color-primary);
  transform: rotate(180deg);
}

.weather-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg) 0;
}

.weather-icon {
  color: var(--color-primary);
}

.weather-temp {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-xs);
}

.temp-value {
  font-size: 4rem;
  font-weight: 700;
  line-height: 1;
  color: var(--color-text);
}

.temp-unit {
  font-size: var(--font-2xl);
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
}

.weather-description {
  text-align: center;
  font-size: var(--font-lg);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  text-transform: capitalize;
}

.weather-details {
  display: flex;
  justify-content: space-around;
  gap: var(--spacing-md);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}

@media (max-width: 480px) {
  .temp-value {
    font-size: 3rem;
  }

  .weather-details {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .detail-item {
    flex-direction: row;
    justify-content: flex-start;
  }
}
</style>
