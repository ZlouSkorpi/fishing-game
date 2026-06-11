import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, Div, Button, Group, Title, Text, Spacing, Slider, SimpleCell } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from '@vkontakte/vk-bridge';

const LAKES = [
  { id: 'pond', name: '🏞️ Деревенский пруд', bgImage: '/images/pond.jpg', fishBonus: 0, fishList: ['Карась', 'Плотва', 'Карп', 'Линь'], nightFishList: ['Сом', 'Налим', 'Угорь'], levelReq: 1, boatReq: false },
  { id: 'river', name: '🏔️ Горная река', bgImage: '/images/river.jpg', fishBonus: 10, fishList: ['Форель', 'Хариус', 'Ленок', 'Таймень'], nightFishList: ['Налим', 'Щука', 'Судак'], levelReq: 3, boatReq: false },
  { id: 'lake', name: '🌊 Глубокое озеро', bgImage: '/images/lake.jpg', fishBonus: 20, fishList: ['Щука', 'Судак', 'Окунь', 'Налим'], nightFishList: ['Сом', 'Щука', 'Карп'], levelReq: 5, boatReq: false },
  { id: 'sea', name: '🌊 Море', bgImage: '/images/sea.jpg', fishBonus: 30, fishList: ['Тунец', 'Морской окунь', 'Камбала', 'Скумбрия'], nightFishList: ['Акула', 'Тунец', 'Камбала'], levelReq: 7, boatReq: false },
  { id: 'deepSea', name: '🚤 Глубокое море', bgImage: '/images/deepsea.jpg', fishBonus: 50, fishList: ['Марлин', 'Акула', 'Кит', 'Рыба-меч'], nightFishList: ['Акула', 'Марлин', 'Рыба-меч'], levelReq: 10, boatReq: true }
];

const RIGGINGS = [
  { id: 'float', name: 'Поплавок', bonus: 0, desc: 'Классическая ловля', price: 0, maxDistance: 25 },
  { id: 'feeder', name: 'Фидер', bonus: 20, desc: '+20% к весу рыбы', price: 300, maxDistance: 60 },
  { id: 'spinning', name: 'Спиннинг', bonus: 30, desc: '+30% к шансу хищника', price: 500, maxDistance: 50 },
  { id: 'jig', name: 'Мормышка', bonus: 10, desc: 'Быстрая поклёвка', price: 200, maxDistance: 15 }
];

const BAITS = [
  { id: 'bait1', name: 'Червь', price: 40, bonusRare: 5, target: 'мирная', icon: '🐛' },
  { id: 'bait2', name: 'Кукуруза', price: 60, bonusRare: 8, target: 'карповые', icon: '🌽' },
  { id: 'bait3', name: 'Муха', price: 80, bonusRare: 10, target: 'лососевые', icon: '🪰' },
  { id: 'bait4', name: 'Блесна', price: 120, bonusRare: 15, target: 'хищник', icon: '✨' },
  { id: 'bait5', name: 'Кальмар', price: 200, bonusRare: 20, target: 'морские', icon: '🦑' }
];

const FEEDS = [
  { id: 'feed1', name: 'Пшено', price: 20, bonus: 5, desc: '+5% к поклёвке', icon: '🌾' },
  { id: 'feed2', name: 'Каша', price: 40, bonus: 10, desc: '+10% к поклёвке', icon: '🍚' },
  { id: 'feed3', name: 'Рыбная мука', price: 80, bonus: 20, desc: '+20% к поклёвке', icon: '🐟' }
];

const RODS = [
  { id: 'rod1', name: 'Бамбуковая', price: 0, speed: 1.0, durabilityMax: 100 },
  { id: 'rod2', name: 'Поплавок-Мастер', price: 120, speed: 1.15, durabilityMax: 100 },
  { id: 'rod3', name: 'Дальнобой', price: 280, speed: 1.3, durabilityMax: 100 },
  { id: 'rod4', name: 'Хищник', price: 500, speed: 1.45, durabilityMax: 100 },
  { id: 'rod5', name: 'Тайфун', price: 900, speed: 1.6, durabilityMax: 100 },
  { id: 'rod6', name: 'Сомолов', price: 1500, speed: 1.75, durabilityMax: 100 },
  { id: 'rod7', name: 'Медведь', price: 2500, speed: 1.9, durabilityMax: 100 },
  { id: 'rod8', name: 'Гарпун', price: 4000, speed: 2.1, durabilityMax: 100 },
  { id: 'rod9', name: 'Аллигатор', price: 6500, speed: 2.3, durabilityMax: 100 },
  { id: 'rod10', name: 'Акула', price: 10000, speed: 2.5, durabilityMax: 100 }
];

const LINES = [
  { id: 'line1', name: 'Нить капроновая 0.12', price: 0, strength: 35, durabilityMax: 100 },
  { id: 'line2', name: 'Леска Крепыш 0.15', price: 100, strength: 45, durabilityMax: 100 },
  { id: 'line3', name: 'Плетёнка Волна 0.18', price: 250, strength: 55, durabilityMax: 100 },
  { id: 'line4', name: 'Шнур Титан 0.20', price: 450, strength: 65, durabilityMax: 100 },
  { id: 'line5', name: 'Флюр Невидимка 0.22', price: 700, strength: 75, durabilityMax: 100 },
  { id: 'line6', name: 'Плетёнка Удав 0.25', price: 1000, strength: 85, durabilityMax: 100 },
  { id: 'line7', name: 'Трос Броня 0.28', price: 1500, strength: 95, durabilityMax: 100 },
  { id: 'line8', name: 'Шнур Стальной 0.30', price: 2200, strength: 105, durabilityMax: 100 },
  { id: 'line9', name: 'Леска Дракон 0.35', price: 3500, strength: 120, durabilityMax: 100 },
  { id: 'line10', name: 'Плетёнка Кит 0.40', price: 5000, strength: 140, durabilityMax: 100 }
];

const REELS = [
  { id: 'reel1', name: 'Деревянная', price: 0, speed: 1.0, durabilityMax: 100 },
  { id: 'reel2', name: 'Вертушка', price: 150, speed: 1.15, durabilityMax: 100 },
  { id: 'reel3', name: 'Тягач', price: 350, speed: 1.3, durabilityMax: 100 },
  { id: 'reel4', name: 'Сибиряк', price: 600, speed: 1.45, durabilityMax: 100 },
  { id: 'reel5', name: 'Дальнобойщик', price: 1000, speed: 1.6, durabilityMax: 100 },
  { id: 'reel6', name: 'Скороход', price: 1800, speed: 1.8, durabilityMax: 100 },
  { id: 'reel7', name: 'Буран', price: 3000, speed: 2.0, durabilityMax: 100 },
  { id: 'reel8', name: 'Ураган', price: 5000, speed: 2.2, durabilityMax: 100 },
  { id: 'reel9', name: 'Смерч', price: 8000, speed: 2.4, durabilityMax: 100 },
  { id: 'reel10', name: 'Цунами', price: 12000, speed: 2.7, durabilityMax: 100 }
];

const HOOKS = [
  { id: 'hook1', name: 'Кованый простой', price: 0, bonusRare: 0, durabilityMax: 100 },
  { id: 'hook2', name: 'Окунёк', price: 80, bonusRare: 4, durabilityMax: 100 },
  { id: 'hook3', name: 'Карасик', price: 180, bonusRare: 7, durabilityMax: 100 },
  { id: 'hook4', name: 'Щучка', price: 300, bonusRare: 10, durabilityMax: 100 },
  { id: 'hook5', name: 'Сомятник', price: 500, bonusRare: 13, durabilityMax: 100 },
  { id: 'hook6', name: 'Карпятник', price: 800, bonusRare: 16, durabilityMax: 100 },
  { id: 'hook7', name: 'Форелька', price: 1200, bonusRare: 20, durabilityMax: 100 },
  { id: 'hook8', name: 'Осьминог', price: 2000, bonusRare: 25, durabilityMax: 100 },
  { id: 'hook9', name: 'Кальмар', price: 3500, bonusRare: 30, durabilityMax: 100 },
  { id: 'hook10', name: 'Акулёнок', price: 5000, bonusRare: 35, durabilityMax: 100 }
];

const WEATHERS = {
  sunny: { name: 'Солнечно', icon: '☀️', biteBonus: 10 },
  rainy: { name: 'Дождь', icon: '🌧️', biteBonus: -10 },
  cloudy: { name: 'Облачно', icon: '☁️', biteBonus: 0 },
  windy: { name: 'Ветрено', icon: '💨', biteBonus: -5 }
};

const SEASON_START = new Date('2026-06-01').getTime();
const SEASON_DURATION = 21 * 24 * 60 * 60 * 1000;
const BATTLE_PASS_LEVELS = 30;
const BATTLE_PASS_XP_PER_LEVEL = 1000;
const BATTLE_PASS_PREMIUM_COST = 100000;

const getCurrentSeason = () => Math.floor((Date.now() - SEASON_START) / SEASON_DURATION);
const getSeasonTimeLeft = () => Math.max(0, SEASON_START + (getCurrentSeason() + 1) * SEASON_DURATION - Date.now());
const getSeasonName = (num) => ['Летний', 'Осенний', 'Зимний', 'Весенний'][num % 4];
const getSeasonEmoji = (num) => ['☀️', '🍂', '❄️', '🌸'][num % 4];

const getBattlePassRewards = (seasonNum) => ({
  free: {
    1: { type: 'coins', amount: 200 },
    3: { type: 'rod', item: { id: 'season_rod', name: 'Сезонная', speed: 1.4, durabilityMax: 100 } },
    5: { type: 'coins', amount: 500 },
    7: { type: 'bait', item: { id: 'bait5', name: 'Кальмар' }, amount: 3 },
    10: { type: 'reel', item: { id: 'season_reel', name: 'Вихрь', speed: 1.7, durabilityMax: 100 } },
    12: { type: 'coins', amount: 800 },
    15: { type: 'line', item: { id: 'season_line', name: 'Гроза', strength: 90, durabilityMax: 100 } },
    18: { type: 'bait', item: { id: 'bait4', name: 'Блесна' }, amount: 5 },
    20: { type: 'hook', item: { id: 'season_hook', name: 'Коготь', bonusRare: 30, durabilityMax: 100 } },
    22: { type: 'coins', amount: 1500 },
    25: { type: 'rigging_universal', desc: 'Оснастка Универсал (50м, +25%)' },
    28: { type: 'feed', item: { id: 'feed3', name: 'Рыбная мука' }, amount: 10 },
    30: { type: 'coins', amount: 3000, title: 'Ветеран' }
  },
  premium: {
    1: { type: 'coins', amount: 500 },
    3: { type: 'rod', item: { id: 'elite_season_rod', name: 'Элитная сезонная', speed: 1.8, durabilityMax: 100 } },
    5: { type: 'bait', item: { id: 'bait5', name: 'Кальмар' }, amount: 5 },
    7: { type: 'double_coins', duration: 120 },
    10: { type: 'reel', item: { id: 'tornado_reel', name: 'Торнадо', speed: 2.2, durabilityMax: 100 } },
    12: { type: 'coins', amount: 2000 },
    15: { type: 'line', item: { id: 'lightning_line', name: 'Молния', strength: 130, durabilityMax: 100 } },
    18: { type: 'feed', item: { id: 'feed3', name: 'Рыбная мука' }, amount: 20 },
    20: { type: 'hook', item: { id: 'harpoon_hook', name: 'Гарпун', bonusRare: 35, durabilityMax: 100 } },
    22: { type: 'tank_upgrade', amount: 5 },
    23: { type: 'durability_shield', duration: 60 },
    25: { type: 'bite_time_boost', amount: 5 },
    28: { type: 'coins', amount: 5000 },
    30: { type: 'rod', item: { id: 'poseidon_rod', name: 'Посейдон', speed: 3.0, durabilityMax: 100 }, title: 'Чемпион' }
  }
});

const WEATHER_FORECAST = ['sunny', 'cloudy', 'rainy', 'windy', 'sunny', 'cloudy', 'windy', 'rainy', 'sunny', 'cloudy'];

const FISH_BASE = {
  'Карась': { weight: 0.5, emoji: '🐡', price: 12, difficulty: 2, rarity: 'common', favoriteBait: 'bait1', favoriteRigging: 'float', minCast: 0, xp: 10, nightOnly: false },
  'Плотва': { weight: 0.2, emoji: '🐠', price: 8, difficulty: 1, rarity: 'common', favoriteBait: 'bait1', favoriteRigging: 'float', minCast: 0, xp: 8, nightOnly: false },
  'Карп': { weight: 3.0, emoji: '🐟', price: 40, difficulty: 4, rarity: 'common', favoriteBait: 'bait2', favoriteRigging: 'feeder', minCast: 30, xp: 30, nightOnly: false },
  'Линь': { weight: 1.2, emoji: '🐟', price: 22, difficulty: 3, rarity: 'common', favoriteBait: 'bait1', favoriteRigging: 'float', minCast: 10, xp: 20, nightOnly: false },
  'Форель': { weight: 1.2, emoji: '🐟', price: 35, difficulty: 3, rarity: 'rare', favoriteBait: 'bait3', favoriteRigging: 'spinning', minCast: 40, xp: 25, nightOnly: false },
  'Хариус': { weight: 0.9, emoji: '🐟', price: 28, difficulty: 2, rarity: 'rare', favoriteBait: 'bait3', favoriteRigging: 'spinning', minCast: 20, xp: 18, nightOnly: false },
  'Ленок': { weight: 1.5, emoji: '🐟', price: 40, difficulty: 3, rarity: 'rare', favoriteBait: 'bait3', favoriteRigging: 'spinning', minCast: 50, xp: 28, nightOnly: false },
  'Таймень': { weight: 8.0, emoji: '🐟', price: 150, difficulty: 7, rarity: 'epic', favoriteBait: 'bait3', favoriteRigging: 'spinning', minCast: 70, xp: 80, nightOnly: false },
  'Щука': { weight: 2.5, emoji: '🐊', price: 55, difficulty: 4, rarity: 'rare', favoriteBait: 'bait4', favoriteRigging: 'spinning', minCast: 20, xp: 40, nightOnly: false },
  'Судак': { weight: 1.8, emoji: '🐉', price: 50, difficulty: 3, rarity: 'rare', favoriteBait: 'bait4', favoriteRigging: 'jig', minCast: 30, xp: 35, nightOnly: false },
  'Окунь': { weight: 0.3, emoji: '🐟', price: 10, difficulty: 1, rarity: 'common', favoriteBait: 'bait4', favoriteRigging: 'jig', minCast: 0, xp: 10, nightOnly: false },
  'Налим': { weight: 2.0, emoji: '🐟', price: 45, difficulty: 3, rarity: 'common', favoriteBait: 'bait1', favoriteRigging: 'feeder', minCast: 40, xp: 35, nightOnly: true },
  'Сом': { weight: 15, emoji: '🐋', price: 200, difficulty: 8, rarity: 'epic', favoriteBait: 'bait2', favoriteRigging: 'feeder', minCast: 50, xp: 120, nightOnly: true },
  'Угорь': { weight: 1.0, emoji: '🐍', price: 60, difficulty: 4, rarity: 'rare', favoriteBait: 'bait1', favoriteRigging: 'float', minCast: 20, xp: 45, nightOnly: true },
  'Тунец': { weight: 20, emoji: '🐟', price: 300, difficulty: 9, rarity: 'epic', favoriteBait: 'bait5', favoriteRigging: 'spinning', minCast: 60, xp: 150, nightOnly: false },
  'Морской окунь': { weight: 2.0, emoji: '🐟', price: 70, difficulty: 3, rarity: 'common', favoriteBait: 'bait5', favoriteRigging: 'jig', minCast: 30, xp: 45, nightOnly: false },
  'Камбала': { weight: 1.5, emoji: '🐟', price: 40, difficulty: 2, rarity: 'common', favoriteBait: 'bait5', favoriteRigging: 'feeder', minCast: 20, xp: 30, nightOnly: false },
  'Скумбрия': { weight: 0.8, emoji: '🐟', price: 28, difficulty: 2, rarity: 'common', favoriteBait: 'bait5', favoriteRigging: 'spinning', minCast: 40, xp: 22, nightOnly: false },
  'Марлин': { weight: 150, emoji: '🐟', price: 1200, difficulty: 15, rarity: 'legendary', favoriteBait: 'bait5', favoriteRigging: 'spinning', minCast: 80, xp: 500, nightOnly: false },
  'Акула': { weight: 300, emoji: '🦈', price: 2000, difficulty: 18, rarity: 'legendary', favoriteBait: 'bait5', favoriteRigging: 'spinning', minCast: 85, xp: 800, nightOnly: false },
  'Рыба-меч': { weight: 200, emoji: '⚔️', price: 1800, difficulty: 16, rarity: 'legendary', favoriteBait: 'bait5', favoriteRigging: 'spinning', minCast: 80, xp: 600, nightOnly: false },
  'Золотая рыбка': { weight: 0.1, emoji: '🐠', price: 800, difficulty: 1, rarity: 'legendary', favoriteBait: null, favoriteRigging: 'float', minCast: 0, xp: 100, nightOnly: false },
  'Кит': { weight: 800, emoji: '🐋', price: 15000, difficulty: 20, rarity: 'legendary', favoriteBait: 'bait5', favoriteRigging: 'spinning', minCast: 60, xp: 5000, nightOnly: false }
};

const ACHIEVEMENTS = [
  { id: 'first_fish', name: 'Первая рыба', desc: 'Поймай свою первую рыбу', target: 1, reward: 50, type: 'catch', progress: 0 },
  { id: 'catcher_10', name: 'Начинающий', desc: 'Поймай 10 рыб', target: 10, reward: 100, type: 'catch', progress: 0 },
  { id: 'catcher_50', name: 'Рыбак', desc: 'Поймай 50 рыб', target: 50, reward: 300, type: 'catch', progress: 0 },
  { id: 'catcher_100', name: 'Профи', desc: 'Поймай 100 рыб', target: 100, reward: 500, type: 'catch', progress: 0 },
  { id: 'catcher_500', name: 'Легенда', desc: 'Поймай 500 рыб', target: 500, reward: 1500, type: 'catch', progress: 0 },
  { id: 'weight_100', name: 'Тяжеловес', desc: 'Набери 100 кг улова', target: 100, reward: 200, type: 'weight', progress: 0 },
  { id: 'weight_500', name: 'Чемпион', desc: 'Набери 500 кг улова', target: 500, reward: 1000, type: 'weight', progress: 0 },
  { id: 'weight_1000', name: 'Машина', desc: 'Набери 1000 кг улова', target: 1000, reward: 2000, type: 'weight', progress: 0 },
  { id: 'rich_1000', name: 'Богач', desc: 'Заработай 1000 монет', target: 1000, reward: 200, type: 'money', progress: 0 },
  { id: 'rich_5000', name: 'Олигарх', desc: 'Заработай 5000 монет', target: 5000, reward: 1000, type: 'money', progress: 0 },
  { id: 'boat_buyer', name: 'Капитан', desc: 'Купи лодку', target: 1, reward: 500, type: 'boat', progress: 0 },
  { id: 'rare_fish', name: 'Редкая удача', desc: 'Поймай золотую рыбку', target: 1, reward: 500, type: 'golden', progress: 0 },
  { id: 'feeder_master', name: 'Фидерный мастер', desc: 'Поймай 50 рыб на фидер', target: 50, reward: 300, type: 'rigging', progress: 0 },
  { id: 'spinning_master', name: 'Спиннингист', desc: 'Поймай 50 рыб на спиннинг', target: 50, reward: 300, type: 'rigging', progress: 0 },
  { id: 'night_fisher', name: 'Ночной рыбак', desc: 'Поймай 10 рыб ночью', target: 10, reward: 400, type: 'night', progress: 0 }
];

function App() {
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('menu');
  const [currentLake, setCurrentLake] = useState(null);
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCatches, setTotalCatches] = useState(0);
  const [maxWeightEver, setMaxWeightEver] = useState(0);
  const [bestCatch, setBestCatch] = useState(null);
  const [lastCatch, setLastCatch] = useState(null);
  const [message, setMessage] = useState('');
  
  const [rods, setRods] = useState([{ id: 'rod1', name: 'Бамбуковая', durability: 100 }]);
  const [lines, setLines] = useState([{ id: 'line1', name: 'Нить капроновая 0.12', durability: 100 }]);
  const [reels, setReels] = useState([{ id: 'reel1', name: 'Деревянная', durability: 100 }]);
  const [hooks, setHooks] = useState([{ id: 'hook1', name: 'Кованый простой', durability: 100 }]);
  const [riggings, setRiggings] = useState(['float']);
  const [baits, setBaits] = useState([]);
  const [feeds, setFeeds] = useState([]);
  
  const [activeRod, setActiveRod] = useState('rod1');
  const [activeLine, setActiveLine] = useState('line1');
  const [activeReel, setActiveReel] = useState('reel1');
  const [activeHook, setActiveHook] = useState('hook1');
  const [activeRigging, setActiveRigging] = useState('float');
  const [activeBait, setActiveBait] = useState(null);
  const [activeFeed, setActiveFeed] = useState(null);
  
  const [gameState, setGameState] = useState('idle');
  const [timer, setTimer] = useState(null);
  const [autoMissTimer, setAutoMissTimer] = useState(null);
  const [animation, setAnimation] = useState('');
  const [reelingProgress, setReelingProgress] = useState(0);
  const [fishFatigue, setFishFatigue] = useState(100);
  const [currentFish, setCurrentFish] = useState(null);
  const [lineTension, setLineTension] = useState(0);
  const [castDistance, setCastDistance] = useState(10);
  const [lastReelTime, setLastReelTime] = useState(0);
  const [fishTank, setFishTank] = useState([]);
  const [tankCapacity, setTankCapacity] = useState(10);
  const [achievements, setAchievements] = useState(ACHIEVEMENTS);
  const [weather, setWeather] = useState('sunny');
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [lastDailyBonus, setLastDailyBonus] = useState(null);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [hasBoat, setHasBoat] = useState(false);
  const [dailyQuests, setDailyQuests] = useState([]);
  const [lastQuestReset, setLastQuestReset] = useState(null);
  const [maxCastBonus, setMaxCastBonus] = useState(100);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [fishCollection, setFishCollection] = useState({});
  const [collectionRewardClaimed, setCollectionRewardClaimed] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
  const [tipsEnabled, setTipsEnabled] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [riggingCatches, setRiggingCatches] = useState({ float: 0, feeder: 0, spinning: 0, jig: 0 });
  const [biteTimeReduction, setBiteTimeReduction] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [nightCatches, setNightCatches] = useState(0);
  const [showFishShadow, setShowFishShadow] = useState(false);
  const [battlePassXp, setBattlePassXp] = useState(0);
  const [battlePassLevel, setBattlePassLevel] = useState(0);
  const [battlePassPremium, setBattlePassPremium] = useState(false);
  const [battlePassClaimed, setBattlePassClaimed] = useState({ free: [], premium: [] });
  const [currentSeason, setCurrentSeason] = useState(getCurrentSeason());
  const [doubleCoinsUntil, setDoubleCoinsUntil] = useState(null);
  const [durabilityShieldUntil, setDurabilityShieldUntil] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  const [eventTimeLeft, setEventTimeLeft] = useState(0);
  const [lastEventCheck, setLastEventCheck] = useState(null);
  const [promoInput, setPromoInput] = useState('');
  const [promoUsed, setPromoUsed] = useState({});
  const [confirmSell, setConfirmSell] = useState({ show: false, type: null, itemId: null, itemName: null, index: null, price: null });
  const [purchaseAnimation, setPurchaseAnimation] = useState(false);

  const loadFromVK = async () => {
    try {
      const localData = localStorage.getItem('fishingGame');
      if (localData) return JSON.parse(localData);
    } catch (e) {}
    try {
      const result = await Promise.race([
        bridge.send('VKWebAppStorageGet', { keys: ['fishingGame'] }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
      ]);
      if (result && result.keys && result.keys[0] && result.keys[0].value) {
        return JSON.parse(result.keys[0].value);
      }
    } catch (e) {}
    return null;
  };

  const saveToVK = async () => {
    const data = {
      totalWeight, totalPrice, totalCatches, maxWeightEver, bestCatch, rods, lines, reels, hooks, riggings, baits, feeds,
      activeRod, activeLine, activeReel, activeHook, activeRigging, activeBait, activeFeed, fishTank, tankCapacity,
      achievements, lastDailyBonus, dailyStreak, level, xp, hasBoat, maxCastBonus, fishCollection, darkTheme,
      dailyQuests, completedQuests, lastQuestReset, tipIndex, riggingCatches, biteTimeReduction, lastAuctionTime,
      nightCatches, storyStep, storyCompleted,
      battlePassXp, battlePassLevel, battlePassPremium, battlePassClaimed, doubleCoinsUntil, durabilityShieldUntil
    };
    localStorage.setItem('fishingGame', JSON.stringify(data));
    try { await bridge.send('VKWebAppStorageSet', { key: 'fishingGame', value: JSON.stringify(data) }); } catch (e) {}
  };

  const addBattlePassXp = (fw) => {
    let nx = battlePassXp + Math.floor(fw * 10), nl = battlePassLevel;
    while (nx >= BATTLE_PASS_XP_PER_LEVEL && nl < BATTLE_PASS_LEVELS) {
      nx -= BATTLE_PASS_XP_PER_LEVEL;
      nl++;
    }
    if (nl >= BATTLE_PASS_LEVELS) { nl = BATTLE_PASS_LEVELS; nx = BATTLE_PASS_XP_PER_LEVEL; }
    setBattlePassXp(nx);
    if (nl > battlePassLevel) {
      setBattlePassLevel(nl);
      setMessage(prev => prev + `\n🔥 Боевой пропуск: Уровень ${nl}!`);
    }
  };

  const usePromo = () => {
    const code = promoInput.toUpperCase().trim();
    if (promoUsed[code]) { setMessage('❌ Промокод уже использован!'); return; }
    const promos = {
      'XK9M322WQ7P4521L8N3R6Y1F5T0H2B9V6D': { type: 'coins', amount: 500000 },
      'XK9234235M2WQ7P1L8N3R6Y1F5T0H2B9V6D': { type: 'xp', amount: 20000 },
      'XK2M2WQ5P4L832334N3R6Y1F5T0H2B9V6D': { type: 'battlepass_xp', amount: 40000 },
    };
    if (promos[code]) {
      const promo = promos[code];
      if (promo.type === 'coins') { setTotalPrice(prev => prev + promo.amount); setMessage(`✅ Промокод активирован! +${promo.amount} 🪙`); }
      else if (promo.type === 'xp') { addXp(promo.amount); setMessage(`✅ Промокод активирован! +${promo.amount} XP для уровня`); }
      else if (promo.type === 'battlepass_xp') { addBattlePassXp(promo.amount / 10); setMessage(`✅ Промокод активирован! +${promo.amount} XP для боевого пропуска`); }
      setPromoUsed(prev => ({ ...prev, [code]: true }));
      setPromoInput('');
    } else { setMessage('❌ Неверный промокод!'); }
  };

  const confirmSellItem = (type, itemId, itemName, index, price) => {
    setConfirmSell({ show: true, type, itemId, itemName, index, price });
  };

  const executeSell = () => {
    const { type, itemId, itemName, index, price } = confirmSell;
    if (type === 'rod' && activeRod === itemId && rods.filter(r => r.id === itemId).length <= 1) { setMessage(`❌ Нельзя продать последнюю экипированную удочку!`); setConfirmSell({ show: false, type: null, itemId: null, itemName: null, index: null, price: null }); return; }
    if (type === 'line' && activeLine === itemId && lines.filter(l => l.id === itemId).length <= 1) { setMessage(`❌ Нельзя продать последнюю экипированную леску!`); setConfirmSell({ show: false, type: null, itemId: null, itemName: null, index: null, price: null }); return; }
    if (type === 'reel' && activeReel === itemId && reels.filter(r => r.id === itemId).length <= 1) { setMessage(`❌ Нельзя продать последнюю экипированную катушку!`); setConfirmSell({ show: false, type: null, itemId: null, itemName: null, index: null, price: null }); return; }
    if (type === 'hook' && activeHook === itemId && hooks.filter(h => h.id === itemId).length <= 1) { setMessage(`❌ Нельзя продать последний экипированный крючок!`); setConfirmSell({ show: false, type: null, itemId: null, itemName: null, index: null, price: null }); return; }
    setTotalPrice(prev => prev + price);
    if (type === 'rod') setRods(prev => prev.filter((_, i) => i !== index));
    if (type === 'line') setLines(prev => prev.filter((_, i) => i !== index));
    if (type === 'reel') setReels(prev => prev.filter((_, i) => i !== index));
    if (type === 'hook') setHooks(prev => prev.filter((_, i) => i !== index));
    setMessage(`✅ Продано: ${itemName} за ${price} 🪙`);
    setConfirmSell({ show: false, type: null, itemId: null, itemName: null, index: null, price: null });
  };

  const buyPremiumPass = () => {
    if (totalPrice >= BATTLE_PASS_PREMIUM_COST && !battlePassPremium) {
      setTotalPrice(prev => prev - BATTLE_PASS_PREMIUM_COST);
      setBattlePassPremium(true);
      setMessage('💎 Премиум активирован!');
    } else if (battlePassPremium) { setMessage('Уже куплен!'); }
    else { setMessage(`Не хватает ${BATTLE_PASS_PREMIUM_COST - totalPrice} 🪙`); }
  };

  const claimBattlePassReward = (level, type) => {
    const seasonData = getBattlePassRewards(currentSeason);
    const rewards = type === 'premium' ? seasonData.premium : seasonData.free;
    const reward = rewards[level];
    if (!reward) return;
    if (type === 'free' && battlePassClaimed.free.includes(level)) return;
    if (type === 'premium' && (battlePassClaimed.premium.includes(level) || !battlePassPremium)) return;
    if (battlePassLevel < level) return;
    if (reward.type === 'coins') { setTotalPrice(prev => prev + reward.amount); setMessage(`✅ +${reward.amount} 🪙`); }
    else if (reward.type === 'rod') { setRods(prev => [...prev, { id: reward.item.id, name: reward.item.name, durability: 100 }]); setMessage(`✅ Удочка ${reward.item.name}!`); }
    else if (reward.type === 'reel') { setReels(prev => [...prev, { id: reward.item.id, name: reward.item.name, durability: 100 }]); setMessage(`✅ Катушка ${reward.item.name}!`); }
    else if (reward.type === 'line') { setLines(prev => [...prev, { id: reward.item.id, name: reward.item.name, durability: 100 }]); setMessage(`✅ Леска ${reward.item.name}!`); }
    else if (reward.type === 'hook') { setHooks(prev => [...prev, { id: reward.item.id, name: reward.item.name, durability: 100 }]); setMessage(`✅ Крючок ${reward.item.name}!`); }
    else if (reward.type === 'bait') { for (let i=0;i<(reward.amount||1);i++) setBaits(prev=>[...prev,{id:reward.item.id,name:reward.item.name}]); setMessage(`✅ ${reward.item.name} x${reward.amount||1}!`); }
    else if (reward.type === 'feed') { for (let i=0;i<(reward.amount||1);i++) setFeeds(prev=>[...prev,{id:reward.item.id,name:reward.item.name}]); setMessage(`✅ ${reward.item.name} x${reward.amount||1}!`); }
    else if (reward.type === 'double_coins') { setDoubleCoinsUntil(Date.now()+reward.duration*60000); setMessage(`✅ x2 монет на ${reward.duration}м!`); }
    else if (reward.type === 'durability_shield') { setDurabilityShieldUntil(Date.now()+reward.duration*60000); setMessage(`✅ Страховка на ${reward.duration}м!`); }
    saveToVK();
    if (type === 'free') setBattlePassClaimed(prev => ({...prev, free: [...prev.free, level]}));
    else setBattlePassClaimed(prev => ({...prev, premium: [...prev.premium, level]}));
  };

  useEffect(() => {
    const handleOnline = () => setMessage('✅ Интернет восстановлен!');
    const handleOffline = () => setMessage('❌ Нет интернета! Проверь соединение.');
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    if (!navigator.onLine) setMessage('❌ Нет интернета! Проверь соединение.');
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
  }, []);

  const [storyStep, setStoryStep] = useState(0);
  const [storyCompleted, setStoryCompleted] = useState(false);
  const story = [
    { id: 1, name: 'Новичок', desc: 'Поймай карася', target: 'Карась', reward: 100, done: false },
    { id: 2, name: 'Любитель', desc: 'Поймай карпа', target: 'Карп', reward: 300, done: false },
    { id: 3, name: 'Охотник', desc: 'Поймай щуку', target: 'Щука', reward: 500, done: false },
    { id: 4, name: 'Профессионал', desc: 'Поймай сома', target: 'Сом', reward: 1000, done: false },
    { id: 5, name: 'Легенда', desc: 'Поймай акулу', target: 'Акула', reward: 3000, done: false }
  ];

  const [auctionFish, setAuctionFish] = useState(null);
  const [auctionBids, setAuctionBids] = useState([]);
  const [auctionTimeLeft, setAuctionTimeLeft] = useState(0);
  const [lastAuctionTime, setLastAuctionTime] = useState(null);
  const [auctionActive, setAuctionActive] = useState(false);

  const tips = [
    "Совет: Кидай дальше — рыба крупнее!",
    "Совет: Не спамь кнопку ТЯНИ, иначе леска порвётся!",
    "Совет: Разная наживка привлекает разную рыбу!",
    "Совет: Покупай улучшения снастей — будет легче вываживать!",
    "Совет: Выполняй ежедневные задания для получения монет!",
    "Совет: Используй прикормку для увеличения клёва!",
    "Совет: Ночью клюёт особая рыба!",
    "Совет: Обменивай одинаковую рыбу на редкие наживки!"
  ];

  const getMaxDistance = () => {
    const rig = RIGGINGS.find(r => r.id === activeRigging);
    return rig?.maxDistance || 25;
  };

  const getDistancePenalties = (dist) => {
    const maxDist = getMaxDistance();
    const percent = dist / maxDist;
    let tensionBonus = 0;
    let breakChanceBonus = 0;
    if (percent > 0.9) { tensionBonus = 40; breakChanceBonus = 20; }
    else if (percent > 0.7) { tensionBonus = 20; breakChanceBonus = 10; }
    return { tensionBonus, breakChanceBonus };
  };

  const isNightTime = () => timeOfDay === 'night';
  const getTimeEmoji = () => isNightTime() ? '🌙' : '☀️';
  const getTimeName = () => isNightTime() ? 'Ночь' : 'День';

  useEffect(() => {
    const loadData = async () => {
      let data = await loadFromVK();
      if (!data) {
        const saved = localStorage.getItem('fishingGame');
        if (saved) data = JSON.parse(saved);
      }
      if (data) {
        setTotalWeight(data.totalWeight || 0);
        setTotalPrice(data.totalPrice || 0);
        setTotalCatches(data.totalCatches || 0);
        setMaxWeightEver(data.maxWeightEver || 0);
        setBestCatch(data.bestCatch || null);
        setRods(data.rods || [{ id: 'rod1', name: 'Бамбуковая', durability: 100 }]);
        setLines(data.lines || [{ id: 'line1', name: 'Нить капроновая 0.12', durability: 100 }]);
        setReels(data.reels || [{ id: 'reel1', name: 'Деревянная', durability: 100 }]);
        setHooks(data.hooks || [{ id: 'hook1', name: 'Кованый простой', durability: 100 }]);
        setRiggings(data.riggings || ['float']);
        setBaits(data.baits || []);
        setFeeds(data.feeds || []);
        setActiveRod(data.activeRod || 'rod1');
        setActiveLine(data.activeLine || 'line1');
        setActiveReel(data.activeReel || 'reel1');
        setActiveHook(data.activeHook || 'hook1');
        setActiveRigging(data.activeRigging || 'float');
        setActiveBait(data.activeBait || null);
        setActiveFeed(data.activeFeed || null);
        setFishTank(data.fishTank || []);
        setTankCapacity(data.tankCapacity || 10);
        setAchievements(data.achievements || ACHIEVEMENTS);
        setLastDailyBonus(data.lastDailyBonus || null);
        setDailyStreak(data.dailyStreak || 0);
        setLevel(data.level || 1);
        setXp(data.xp || 0);
        setHasBoat(data.hasBoat || false);
        setMaxCastBonus(data.maxCastBonus || 100);
        setFishCollection(data.fishCollection || {});
        setDarkTheme(data.darkTheme || false);
        setDailyQuests(data.dailyQuests || []);
        setCompletedQuests(data.completedQuests || []);
        setLastQuestReset(data.lastQuestReset || null);
        setTipIndex(data.tipIndex || 0);
        setRiggingCatches(data.riggingCatches || { float: 0, feeder: 0, spinning: 0, jig: 0 });
        setBiteTimeReduction(data.biteTimeReduction || 0);
        setLastAuctionTime(data.lastAuctionTime || null);
        setNightCatches(data.nightCatches || 0);
        setStoryStep(data.storyStep || 0);
        setStoryCompleted(data.storyCompleted || false);
        setBattlePassXp(data.battlePassXp || 0);
        setBattlePassLevel(data.battlePassLevel || 0);
        setBattlePassPremium(data.battlePassPremium || false);
        setBattlePassClaimed(data.battlePassClaimed || { free: [], premium: [] });
        setDoubleCoinsUntil(data.doubleCoinsUntil || null);
        setDurabilityShieldUntil(data.durabilityShieldUntil || null);
      }
      const hour = new Date().getHours();
      setTimeOfDay(hour >= 6 && hour < 22 ? 'day' : 'night');
      const currentWeatherIndex = Math.floor(Math.random() * WEATHER_FORECAST.length);
      const forecast = [];
      for (let i = 0; i < 4; i++) forecast.push(WEATHER_FORECAST[(currentWeatherIndex + i) % WEATHER_FORECAST.length]);
      setWeatherForecast(forecast);
      setWeather(forecast[0]);
      resetDailyQuests();
      const timeInterval = setInterval(() => {
        const h = new Date().getHours();
        setTimeOfDay(h >= 6 && h < 22 ? 'day' : 'night');
      }, 900000);
      const weatherInterval = setInterval(() => {
        setWeatherForecast(prev => {
          const newForecast = [...prev.slice(1), WEATHER_FORECAST[Math.floor(Math.random() * WEATHER_FORECAST.length)]];
          setWeather(newForecast[0]);
          return newForecast;
        });
      }, 900000);
      setTimeout(() => setLoading(false), 1500);
      return () => { clearInterval(timeInterval); clearInterval(weatherInterval); };
    };
    loadData();
  }, []);

  useEffect(() => {
    if (auctionActive && auctionTimeLeft > 0) {
      const auctionTimer = setInterval(() => {
        setAuctionTimeLeft(prev => {
          if (prev <= 1) { setAuctionActive(false); setAuctionFish(null); setAuctionBids([]); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(auctionTimer);
    }
  }, [auctionActive, auctionTimeLeft]);

  useEffect(() => {
    const data = { 
      totalWeight, totalPrice, totalCatches, maxWeightEver, bestCatch, rods, lines, reels, hooks, riggings, baits, feeds,
      activeRod, activeLine, activeReel, activeHook, activeRigging, activeBait, activeFeed, fishTank, tankCapacity,
      achievements, lastDailyBonus, dailyStreak, level, xp, hasBoat, maxCastBonus, fishCollection, darkTheme,
      dailyQuests, completedQuests, lastQuestReset, tipIndex, riggingCatches, biteTimeReduction, lastAuctionTime,
      nightCatches, storyStep, storyCompleted,
      battlePassXp, battlePassLevel, battlePassPremium, battlePassClaimed, doubleCoinsUntil, durabilityShieldUntil
    };
    localStorage.setItem('fishingGame', JSON.stringify(data));
    saveToVK();
  }, [totalWeight, totalPrice, totalCatches, maxWeightEver, bestCatch, rods, lines, reels, hooks, riggings, baits, feeds,
    activeRod, activeLine, activeReel, activeHook, activeRigging, activeBait, activeFeed, fishTank, tankCapacity,
    achievements, lastDailyBonus, dailyStreak, level, xp, hasBoat, maxCastBonus, fishCollection, darkTheme,
    dailyQuests, completedQuests, lastQuestReset, tipIndex, riggingCatches, biteTimeReduction, lastAuctionTime,
    nightCatches, storyStep, storyCompleted,
    battlePassXp, battlePassLevel, battlePassPremium, battlePassClaimed, doubleCoinsUntil, durabilityShieldUntil]);

  const resetDailyQuests = () => {
    const today = new Date().toDateString();
    if (!lastQuestReset || lastQuestReset !== today) {
      setDailyQuests([
        { id: 'quest1', name: 'Ловец', desc: 'Поймай 5 любых рыб', target: 5, progress: 0, reward: 50, type: 'catch' },
        { id: 'quest2', name: 'Вес', desc: 'Набери 20 кг улова', target: 20, progress: 0, reward: 60, type: 'weight' },
        { id: 'quest3', name: 'Монеты', desc: 'Заработай 100 монет', target: 100, progress: 0, reward: 70, type: 'money' }
      ]);
      setCompletedQuests([]);
      setLastQuestReset(today);
    }
  };

  const checkStoryProgress = (fishName) => {
    if (storyCompleted) return;
    const currentTask = story[storyStep];
    if (currentTask && fishName === currentTask.target && !currentTask.done) {
      const newStory = [...story];
      newStory[storyStep].done = true;
      setTotalPrice(prev => prev + currentTask.reward);
      setMessage(prev => prev + `\n📜 Задание: ${currentTask.name} выполнен! +${currentTask.reward} 🪙`);
      if (storyStep < story.length - 1) setStoryStep(prev => prev + 1);
      else { setStoryCompleted(true); setMessage(prev => prev + `\n🎉 СЮЖЕТ ПРОЙДЕН! Спасибо, рыбак!`); }
    }
  };

  const showNextTip = () => {
    if (!tipsEnabled) return;
    if (tipIndex < tips.length && totalCatches > 0 && totalCatches % 3 === 0) {
      setShowTip(true);
      setMessage(prev => prev + `\n${tips[tipIndex]}`);
      setTipIndex(prev => prev + 1);
      setTimeout(() => setShowTip(false), 5000);
    }
  };

  const updateQuests = (type, value) => {
    let updated = false;
    const newQuests = dailyQuests.map(quest => {
      if (completedQuests.includes(quest.id)) return quest;
      let newProgress = quest.progress;
      if (quest.type === 'catch') newProgress += value;
      if (quest.type === 'weight') newProgress += value;
      if (quest.type === 'money') newProgress += value;
      if (newProgress >= quest.target && !completedQuests.includes(quest.id)) {
        setTotalPrice(prev => prev + quest.reward);
        setMessage(prev => prev + `\n📋 Задание: ${quest.name}! +${quest.reward} 🪙`);
        setCompletedQuests(prev => [...prev, quest.id]);
        updated = true;
        return { ...quest, progress: quest.target };
      }
      return { ...quest, progress: newProgress };
    });
    if (updated) setDailyQuests(newQuests);
  };

  const checkAchievements = (type, value = 1) => {
    let updated = false;
    const newAchievements = achievements.map(ach => {
      if (ach.completed) return ach;
      let newProgress = ach.progress;
      if (ach.type === 'catch') newProgress = totalCatches + value;
      if (ach.type === 'weight') newProgress = totalWeight + value;
      if (ach.type === 'money') newProgress = totalPrice;
      if (ach.type === 'boat' && type === 'boat') newProgress = hasBoat ? 1 : 0;
      if (ach.type === 'golden' && type === 'golden') newProgress = ach.progress + 1;
      if (ach.type === 'rigging' && type === ach.id) newProgress = riggingCatches[ach.id.split('_')[0]] + value;
      if (ach.type === 'night' && type === 'night') newProgress = nightCatches + value;
      if (newProgress >= ach.target && !ach.completed) {
        setTotalPrice(prev => prev + ach.reward);
        setMessage(prev => prev + `\n🏆 Достижение: ${ach.name}! +${ach.reward} 🪙`);
        updated = true;
        return { ...ach, progress: ach.target, completed: true };
      }
      return { ...ach, progress: newProgress };
    });
    if (updated) setAchievements(newAchievements);
  };

  const updateCollection = (fishName, fishWeight, fishEmoji, fishPrice) => {
    if (!fishCollection[fishName]) {
      setFishCollection(prev => ({ ...prev, [fishName]: true }));
      const collectedCount = Object.keys(fishCollection).length + 1;
      const totalFish = Object.keys(FISH_BASE).length;
      if (collectedCount === totalFish && !collectionRewardClaimed) {
        setTotalPrice(prev => prev + 2000);
        setCollectionRewardClaimed(true);
        setMessage(prev => prev + `\n🎉 КОЛЛЕКЦИЯ ПОЛНА! +2000 🪙`);
      }
      if (collectedCount % 5 === 0) {
        setTotalPrice(prev => prev + 500);
        setMessage(prev => prev + `\n🎉 Собрано ${collectedCount} видов! +500 🪙`);
      }
    }
    if (fishWeight > maxWeightEver) {
      setMaxWeightEver(fishWeight);
      setBestCatch({ name: fishName, weight: fishWeight, emoji: fishEmoji, price: fishPrice });
      setMessage(prev => prev + `\n🏆 НОВЫЙ РЕКОРД! ${fishName} ${fishWeight} кг!`);
    }
  };

  const addXp = (amount) => {
    let newXp = xp + amount;
    let newLevel = level;
    let leveledUp = false;
    while (newXp >= newLevel * 100) { newXp -= newLevel * 100; newLevel++; leveledUp = true; }
    if (leveledUp) {
      setMessage(prev => prev + `\n🎉 УРОВЕНЬ ${newLevel}! Время поклёвки -2%!`);
      setBiteTimeReduction(prev => prev + 2);
    }
    setXp(newXp);
    setLevel(newLevel);
  };

  const buyItem = (type, item, price) => {
    if (totalPrice >= price) {
      setTotalPrice(prev => prev - price);
      if (type === 'rod') setRods(prev => [...prev, { id: item.id, name: item.name, durability: 100 }]);
      if (type === 'line') setLines(prev => [...prev, { id: item.id, name: item.name, durability: 100 }]);
      if (type === 'reel') setReels(prev => [...prev, { id: item.id, name: item.name, durability: 100 }]);
      if (type === 'hook') setHooks(prev => [...prev, { id: item.id, name: item.name, durability: 100 }]);
      if (type === 'rigging') setRiggings(prev => [...prev, item.id]);
      if (type === 'bait') setBaits(prev => [...prev, { id: item.id, name: item.name }]);
      if (type === 'feed') setFeeds(prev => [...prev, { id: item.id, name: item.name }]);
      alert(`✅ Куплено: ${item.name}!`);
    } else {
      alert(`❌ Не хватает ${price - totalPrice} 🪙`);
    }
  };

  const equipItem = (type, itemId) => {
    if (type === 'rod') setActiveRod(itemId);
    if (type === 'line') setActiveLine(itemId);
    if (type === 'reel') setActiveReel(itemId);
    if (type === 'hook') setActiveHook(itemId);
    if (type === 'rigging') setActiveRigging(itemId);
    if (type === 'bait') setActiveBait(itemId);
    if (type === 'feed') setActiveFeed(itemId);
    setMessage(`Экипировано!`);
  };

  const getActiveRodData = () => RODS.find(r => r.id === activeRod);
  const getActiveLineData = () => LINES.find(l => l.id === activeLine);
  const getActiveReelData = () => REELS.find(r => r.id === activeReel);
  const getActiveHookData = () => HOOKS.find(h => h.id === activeHook);
  const getActiveRiggingData = () => RIGGINGS.find(r => r.id === activeRigging);
  const getRodDurability = () => rods.find(r => r.id === activeRod)?.durability || 100;
  const getLineDurability = () => lines.find(l => l.id === activeLine)?.durability || 100;
  const getReelDurability = () => reels.find(r => r.id === activeReel)?.durability || 100;
  const getHookDurability = () => hooks.find(h => h.id === activeHook)?.durability || 100;

  const updateDurabilities = (fishWeight) => {
    const durabilityLoss = Math.floor(fishWeight / 5) + 1;
    setRods(prev => prev.map(r => r.id === activeRod ? { ...r, durability: Math.max(0, r.durability - durabilityLoss) } : r));
    setLines(prev => prev.map(l => l.id === activeLine ? { ...l, durability: Math.max(0, l.durability - durabilityLoss) } : l));
    setReels(prev => prev.map(r => r.id === activeReel ? { ...r, durability: Math.max(0, r.durability - durabilityLoss) } : r));
    setHooks(prev => prev.map(h => h.id === activeHook ? { ...h, durability: Math.max(0, h.durability - durabilityLoss) } : h));
  };

  const useFeed = () => {
    if (activeFeed && feeds.length > 0) {
      const idx = feeds.findIndex(f => f.id === activeFeed);
      if (idx !== -1) { setFeeds(prev => prev.filter((_, i) => i !== idx)); setActiveFeed(null); return true; }
    }
    return false;
  };

  const useBait = () => {
    if (activeBait && baits.length > 0) {
      const idx = baits.findIndex(b => b.id === activeBait);
      if (idx !== -1) { setBaits(prev => prev.filter((_, i) => i !== idx)); setActiveBait(null); return true; }
    }
    return false;
  };

  const claimDailyBonus = () => {
    const today = new Date().toDateString();
    if (lastDailyBonus === today) { setMessage('Сегодня уже получал бонус!'); return; }
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const newStreak = lastDailyBonus === yesterday.toDateString() ? dailyStreak + 1 : 1;
    let bonus = 50 + newStreak * 10;
    if (newStreak === 7) { bonus += 500; setFeeds(prev => [...prev, { id: 'feed3', name: 'Рыбная мука' }]); }
    setTotalPrice(prev => prev + bonus);
    setDailyStreak(newStreak);
    setLastDailyBonus(today);
    setMessage(`🎁 Бонус! +${bonus} 🪙 (${newStreak} дн.)`);
  };

  const getAvailableFish = () => {
    const lake = LAKES.find(l => l.id === currentLake);
    let fishList = isNightTime() && lake?.nightFishList ? lake.nightFishList : lake?.fishList || [];
    fishList = fishList.filter(fishName => castDistance >= (FISH_BASE[fishName]?.minCast || 0));
    fishList = fishList.filter(fishName => FISH_BASE[fishName]?.favoriteRigging === activeRigging);
    if (activeBait) {
      const baitTarget = BAITS.find(b => b.id === activeBait)?.target;
      fishList = fishList.filter(fishName => {
        const fish = FISH_BASE[fishName];
        if (baitTarget === 'мирная') return fish.favoriteBait === 'bait1' || fish.favoriteBait === 'bait2';
        if (baitTarget === 'карповые') return fish.favoriteBait === 'bait2';
        if (baitTarget === 'лососевые') return fish.favoriteBait === 'bait3';
        if (baitTarget === 'хищник') return fish.favoriteBait === 'bait4';
        if (baitTarget === 'морские') return fish.favoriteBait === 'bait5';
        return true;
      });
    }
    if (fishList.length === 0) fishList = lake?.fishList || ['Карась'];
    return fishList;
  };

  const getRandomFish = (lakeBonus) => {
    const hookBonus = getActiveHookData()?.bonusRare || 0;
    const baitBonus = activeBait ? (BAITS.find(b => b.id === activeBait)?.bonusRare || 0) : 0;
    const riggingBonus = getActiveRiggingData()?.bonus || 0;
    const weatherBonus = WEATHERS[weather]?.biteBonus || 0;
    const distanceBonus = castDistance / 15;
    const feedBonus = activeFeed ? (FEEDS.find(f => f.id === activeFeed)?.bonus || 0) : 0;
    const totalBonus = hookBonus + baitBonus + riggingBonus + (lakeBonus || 0) + distanceBonus + weatherBonus + feedBonus;
    if (Math.random() * 100 < 3 + totalBonus / 8) return { name: 'Золотая рыбка', ...FISH_BASE['Золотая рыбка'] };
    if (Math.random() * 100 < 0.2 && castDistance >= 60 && activeRigging === 'spinning') return { name: 'Кит', ...FISH_BASE['Кит'] };
    const possibleFish = getAvailableFish();
    const fishName = possibleFish[Math.floor(Math.random() * possibleFish.length)];
    return { name: fishName, ...FISH_BASE[fishName] };
  };

  const startFishing = (lakeId) => {
    const lake = LAKES.find(l => l.id === lakeId);
    if (level < lake.levelReq) { setMessage(`Нужен ${lake.levelReq} ур.`); return; }
    if (lake.boatReq && !hasBoat) { setMessage(`Нужна лодка (2000 🪙)`); return; }
    setCurrentLake(lakeId);
    setCurrentScreen('gear');
  };

  const startFishingWithGear = () => {
    if (getRodDurability() <= 0 || getLineDurability() <= 0 || getReelDurability() <= 0 || getHookDurability() <= 0) {
      setMessage(`Снасти сломаны! Замени в инвентаре.`); return;
    }
    setCurrentScreen('game');
    setCastDistance(Math.min(20, getMaxDistance()));
    setMessage('Выбери дальность и нажми Закинуть!');
  };

  const castLine = () => {
    if (gameState !== 'idle') return;
    setGameState('casting');
    setAnimation('cast');
    setMessage(`Заброс на ${Math.floor(castDistance)}м...`);
    setTimeout(() => {
      setGameState('waiting');
      setAnimation('float');
      let biteDelay = 2000 + (castDistance * 100) + Math.random() * 5000;
      if (activeFeed) biteDelay *= 0.7;
      biteDelay *= (1 - biteTimeReduction / 100);
      setMessage(`Жди поклёвку (${Math.floor(castDistance)}м, ${WEATHERS[weather].name})`);
      const newTimer = setTimeout(() => {
        const fish = getRandomFish(LAKES.find(l => l.id === currentLake)?.fishBonus || 0);
        setCurrentFish(fish);
        setGameState('biting');
        setAnimation('bite');
        setShowFishShadow(true);
        setTimeout(() => setShowFishShadow(false), 2000);
        setMessage(`КЛЮЁТ! Нажимай Подсечь!`);
        const missTimer = setTimeout(() => {
          if (gameState === 'biting') { setMessage(`Рыба ушла...`); setGameState('idle'); setAnimation(''); setCurrentFish(null); setShowFishShadow(false); }
        }, 5000);
        setAutoMissTimer(missTimer);
      }, biteDelay);
      setTimer(newTimer);
    }, 500);
  };

  const recastLine = () => {
    if (timer) { clearTimeout(timer); setTimer(null); }
    if (autoMissTimer) { clearTimeout(autoMissTimer); setAutoMissTimer(null); }
    setGameState('idle');
    setTimeout(() => castLine(), 100);
  };

  const hookFish = () => {
    if (gameState !== 'biting') return;
    if (timer) { clearTimeout(timer); setTimer(null); }
    if (autoMissTimer) { clearTimeout(autoMissTimer); setAutoMissTimer(null); }
    setGameState('reeling');
    setReelingProgress(0); setFishFatigue(100); setLineTension(0);
    setMessage(`Подсекли! Вываживай!`);
    setAnimation('hooked');
    setShowFishShadow(false);
  };

  const reelTick = () => {
    if (gameState !== 'reeling') return;
    const now = Date.now();
    if (lastReelTime && now - lastReelTime < 200) { setMessage('НЕ СПАМЬ!'); return; }
    setLastReelTime(now);
    const rodSpeed = getActiveRodData()?.speed || 1;
    const reelSpeed = getActiveReelData()?.speed || 1;
    const lineStrength = getActiveLineData()?.strength || 50;
    const fishWeight = currentFish?.weight || 1;
    const fishDifficulty = currentFish?.difficulty || 3;
    const fishRarity = currentFish?.rarity || 'common';
    const penalties = getDistancePenalties(castDistance);
    let pullAmount = (rodSpeed * reelSpeed) * (1 + (100 - fishFatigue) / 100) / (fishWeight / 5);
    pullAmount = Math.min(pullAmount, 8);
    let tensionIncrease = (fishWeight / 10) * (fishDifficulty / 5) * (rodSpeed * 0.8) * (100 / lineStrength);
    tensionIncrease = Math.min(tensionIncrease, 15);
    tensionIncrease *= (1 + penalties.tensionBonus / 100);
    if (fishRarity === 'rare') tensionIncrease *= 1.3;
    else if (fishRarity === 'epic') tensionIncrease *= 1.6;
    else if (fishRarity === 'legendary') tensionIncrease *= 2;
    const newProgress = reelingProgress + pullAmount;
    setReelingProgress(newProgress);
    let newFatigue = fishFatigue - (rodSpeed * 2) - Math.random() * 10;
    if (fishRarity === 'rare') newFatigue -= 3;
    else if (fishRarity === 'epic') newFatigue -= 6;
    else if (fishRarity === 'legendary') newFatigue -= 10;
    setFishFatigue(Math.max(0, newFatigue));
    let newTension = lineTension + tensionIncrease;
    if (lastReelTime && now - lastReelTime < 100) newTension += 20;
    if (penalties.breakChanceBonus > 0 && Math.random() * 100 < penalties.breakChanceBonus) newTension += 30;
    if (fishFatigue <= 10) newTension = Math.max(0, newTension * 0.3);
    if (fishFatigue < 30) newTension = Math.max(0, newTension - 8);
    setLineTension(newTension);
    if (newTension >= 100) {
      setMessage(`ЛЕСКА ПОРВАЛАСЬ!`);
      updateDurabilities(fishWeight);
      setGameState('idle'); setAnimation(''); setCurrentFish(null); setLineTension(0);
      return;
    }
    if (newProgress >= 100) {
      setGameState('caught');
      setMessage(`Поймал ${currentFish.name} (${currentFish.weight} кг)!`);
      setAnimation('');
    }
  };

  const addToTank = () => {
    if (fishTank.length >= tankCapacity) { setMessage(`Садок полон!`); return; }
    const newFish = { id: Date.now(), name: currentFish.name, weight: currentFish.weight, emoji: currentFish.emoji, price: currentFish.price, rarity: currentFish.rarity, date: new Date().toLocaleTimeString() };
    setFishTank(prev => [...prev, newFish]);
    setTotalWeight(prev => +(prev + currentFish.weight).toFixed(1));
    setTotalPrice(prev => prev + currentFish.price);
    setTotalCatches(prev => prev + 1);
    addXp(currentFish.xp);
    addBattlePassXp(currentFish.weight);
    updateCollection(currentFish.name, currentFish.weight, currentFish.emoji, currentFish.price);
    updateQuests('catch', 1); updateQuests('weight', currentFish.weight); updateQuests('money', currentFish.price);
    checkAchievements('catch', 1); checkAchievements('weight', currentFish.weight); checkAchievements('money');
    if (currentFish.name === 'Золотая рыбка') checkAchievements('golden');
    checkAchievements(activeRigging + '_master', 1);
    if (isNightTime()) { setNightCatches(prev => prev + 1); checkAchievements('night', 1); }
    setRiggingCatches(prev => ({ ...prev, [activeRigging]: prev[activeRigging] + 1 }));
    updateDurabilities(currentFish.weight);
    checkStoryProgress(currentFish.name);
    useFeed(); useBait(); showNextTip();
    setMessage(`В садок! +${currentFish.price} 🪙 +${currentFish.xp} XP`);
    setGameState('idle'); setCurrentFish(null); setLineTension(0);
  };

  const releaseFish = () => {
    setMessage(`Отпустил ${currentFish.name}`);
    setGameState('idle'); setCurrentFish(null); setLineTension(0);
  };

  const sellFromTank = (fishId, price) => {
    setFishTank(prev => prev.filter(f => f.id !== fishId));
    setTotalPrice(prev => prev + price);
  };

  const sellAllFromTank = () => {
    const total = fishTank.reduce((sum, fish) => sum + fish.price, 0);
    setTotalPrice(prev => prev + total);
    setFishTank([]);
    setMessage(`Продано всё! +${total} 🪙`);
  };

  const exchangeFish = (fishName) => {
    const sameFish = fishTank.filter(f => f.name === fishName);
    if (sameFish.length >= 5) {
      const toRemove = sameFish.slice(0, 5).map(f => f.id);
      setFishTank(prev => prev.filter(f => !toRemove.includes(f.id)));
      setBaits(prev => [...prev, { id: 'bait5', name: 'Кальмар' }]);
      setMessage(`Обменял 5 ${fishName} на Кальмар!`);
    } else { setMessage(`Нужно 5 ${fishName} для обмена`); }
  };

  const upgradeTank = () => {
    const price = tankCapacity * 50;
    if (totalPrice >= price) { setTotalPrice(prev => prev - price); setTankCapacity(prev => prev + 5); setMessage(`Садок расширен!`); }
    else setMessage(`Не хватает ${price - totalPrice} 🪙`);
  };

  const buyBoat = () => {
    if (!hasBoat && totalPrice >= 2000) { setTotalPrice(prev => prev - 2000); setHasBoat(true); setMessage('Лодка куплена!'); }
    else if (hasBoat) setMessage('Уже есть лодка');
    else setMessage(`Не хватает ${2000 - totalPrice} 🪙`);
  };

  const startAuction = (fish) => {
    const now = Date.now();
    if (lastAuctionTime && now - lastAuctionTime < 3 * 3600000) {
      setMessage(`Аукцион через ${Math.ceil((3*3600000 - (now - lastAuctionTime))/60000)} мин.`); return;
    }
    setAuctionFish(fish); setFishTank(prev => prev.filter(f => f.id !== fish.id));
    const npcs = ['Купец', 'Коллекционер', 'Ресторатор'];
    setAuctionBids(npcs.map(npc => ({ npc, multiplier: 0.8 + Math.random() * 2.2 })));
    setAuctionTimeLeft(30); setAuctionActive(true); setLastAuctionTime(now);
    setMessage(`Аукцион! 30 сек.`);
  };

  const acceptBid = (index) => {
    if (!auctionFish || !auctionActive) return;
    const finalPrice = Math.floor(auctionFish.price * auctionBids[index].multiplier);
    setTotalPrice(prev => prev + finalPrice);
    setMessage(`Продано за ${finalPrice} 🪙`);
    setAuctionActive(false); setAuctionFish(null); setAuctionBids([]);
  };

  const rejectAllBids = () => {
    if (!auctionFish) return;
    setFishTank(prev => [...prev, auctionFish]);
    setAuctionActive(false); setAuctionFish(null); setAuctionBids([]);
  };

  const missFish = () => {
    if (timer) { clearTimeout(timer); setTimer(null); }
    if (autoMissTimer) { clearTimeout(autoMissTimer); setAutoMissTimer(null); }
    setMessage('Сорвалась...');
    setGameState('idle'); setAnimation(''); setCurrentFish(null); setShowFishShadow(false);
  };

  const goToMenu = () => {
    setCurrentScreen('menu'); setCurrentLake(null); setGameState('idle'); setCurrentFish(null);
    if (timer) clearTimeout(timer); if (autoMissTimer) clearTimeout(autoMissTimer); setShowFishShadow(false);
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: darkTheme ? '#0a0a0a' : 'linear-gradient(135deg, #0a4a6e, #1a6d8f)', color: 'white' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px', animation: 'float 2s ease-in-out infinite' }}>🎣</div>
        <Title level="1" style={{ color: 'white' }}>РЫБАЛКА VK</Title>
        <Spacing size={20} />
        <div className="loader"></div>
        <Text style={{ marginTop: '20px', color: '#ddd' }}>Загрузка...</Text>
        <style>{`
          @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
          .loader { width: 48px; height: 48px; border: 5px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: #ff8c00; animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (currentScreen === 'menu') {
    const completedAchievements = achievements.filter(a => a.completed).length;
    const completedQuestsCount = completedQuests.length;
    const totalQuests = dailyQuests.length;
    const collectedCount = Object.keys(fishCollection).length;
    const totalFish = Object.keys(FISH_BASE).length;
    const xpProgress = (xp / (level * 100)) * 100;
    const bpProgress = (battlePassXp / BATTLE_PASS_XP_PER_LEVEL) * 100;
    const seasonTimeLeft = getSeasonTimeLeft();
    const daysLeft = Math.floor(seasonTimeLeft / (24 * 3600000));
    const hoursLeft = Math.floor((seasonTimeLeft % (24 * 3600000)) / 3600000);
    
    return (
      <div style={{ minHeight: '100vh', background: darkTheme ? '#0a0a0a' : 'linear-gradient(145deg, #0a4a6e, #1a6d8f)', padding: '16px' }}>
        <PanelHeader style={{ background: darkTheme ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)', color: 'white' }} after={<span style={{ cursor: 'pointer', fontSize: '20px' }} onClick={() => setDarkTheme(!darkTheme)}>{darkTheme ? '☀️' : '🌙'}</span>}>🎣 РЫБАЛКА VK</PanelHeader>
        <Group style={{ background: 'transparent' }}>
          <Div>
            <div style={{ background: darkTheme ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)', borderRadius: '24px', padding: '16px', marginBottom: '20px', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '24px' }}>{getTimeEmoji()} {getTimeName()}</div>
                <div><span style={{ fontSize: '20px' }}>⭐ Ур. {level}</span></div>
                <div style={{ fontSize: '14px' }}>{WEATHERS[weather].icon} {WEATHERS[weather].name}</div>
              </div>
              <div style={{ background: '#333', borderRadius: '10px', height: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{ background: '#ff8c00', width: `${xpProgress}%`, height: '100%', transition: 'width 0.2s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '12px' }}>
                <div>🪙 {totalPrice}</div>
                <div>🐟 {totalCatches}</div>
                <div>🏅 {completedAchievements}/{achievements.length}</div>
              </div>
              <div style={{ fontSize: '11px', marginTop: '8px', color: '#ccc' }}>
                Прогноз: {weatherForecast.map((w, i) => <span key={i}>{WEATHERS[w].icon} </span>)}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <Button size="s" onClick={claimDailyBonus} style={{ background: '#ff8c00', flex: 1 }}>🎁 БОНУС</Button>
                <Button size="s" onClick={resetDailyQuests} style={{ background: '#4caf50', flex: 1 }}>📋 ЗАДАНИЯ ({completedQuestsCount}/{totalQuests})</Button>
              </div>
            </div>
            <div style={{ background: battlePassPremium ? 'linear-gradient(135deg, #ff8c00, #ff4444)' : '#333', borderRadius: '20px', padding: '16px', marginBottom: '16px', textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>🔥 СЕЗОН {currentSeason + 1} ({getSeasonEmoji(currentSeason)} {getSeasonName(currentSeason)})</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>Осталось: {daysLeft}д {hoursLeft}ч</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                <span>Ур. {battlePassLevel}/{BATTLE_PASS_LEVELS}</span>
                <div style={{ flex: 1, background: '#555', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ background: '#ffd700', width: `${bpProgress}%`, height: '100%' }} />
                </div>
                <span>{battlePassXp}/{BATTLE_PASS_XP_PER_LEVEL}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <Button size="s" onClick={() => setCurrentScreen('battlepass')} style={{ background: '#ffd700', color: '#333', flex: 1 }}>📊 НАГРАДЫ</Button>
                {!battlePassPremium && <Button size="s" onClick={buyPremiumPass} style={{ background: '#ff4444', flex: 1 }}>💎 ПРЕМИУМ {BATTLE_PASS_PREMIUM_COST} 🪙</Button>}
              </div>
            </div>
            {!storyCompleted && story[storyStep] && (
              <div style={{ background: '#8B4513', borderRadius: '16px', padding: '12px', marginBottom: '16px', textAlign: 'center', color: 'white' }}>
                <Text>📜 Задание: {story[storyStep].desc} — награда {story[storyStep].reward} 🪙</Text>
              </div>
            )}
            {auctionActive && auctionFish && (
              <div style={{ background: '#ff8c00', borderRadius: '24px', padding: '16px', marginBottom: '20px', textAlign: 'center', color: 'white' }}>
                <div>🔥 АУКЦИОН! {auctionTimeLeft}с</div>
                <div style={{ fontSize: '40px' }}>{auctionFish.emoji}</div>
                <div>{auctionFish.name} — {auctionFish.weight} кг</div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {auctionBids.map((bid, i) => (
                    <Button key={i} size="s" onClick={() => acceptBid(i)} style={{ background: '#4caf50' }}>{bid.npc}: {Math.floor(auctionFish.price * bid.multiplier)} 🪙</Button>
                  ))}
                  <Button size="s" onClick={rejectAllBids} style={{ background: '#666' }}>Отклонить</Button>
                </div>
              </div>
            )}
            <Title level="2" style={{ color: 'white', marginBottom: '16px', textAlign: 'center' }}>🌍 Выбери водоём</Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {LAKES.map(lake => (
                <div key={lake.id} onClick={() => startFishing(lake.id)} style={{ 
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${lake.bgImage})`,
                  backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '24px', padding: '20px',
                  cursor: level >= lake.levelReq && (!lake.boatReq || hasBoat) ? 'pointer' : 'not-allowed',
                  opacity: level >= lake.levelReq && (!lake.boatReq || hasBoat) ? 1 : 0.7,
                  border: '1px solid rgba(255,255,255,0.2)', color: 'white'
                }}>
                  <div style={{ fontSize: '28px', textShadow: '2px 2px 4px black' }}>{lake.name}</div>
                  <div style={{ fontSize: '14px', textShadow: '1px 1px 2px black' }}>Бонус: +{lake.fishBonus}% | Треб: {lake.levelReq} ур.</div>
                  <div style={{ fontSize: '12px', marginTop: '8px', textShadow: '1px 1px 2px black' }}>
                    🐟 {isNightTime() && lake.nightFishList ? lake.nightFishList.join(' · ') : lake.fishList.join(' · ')}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <Button stretched onClick={() => setCurrentScreen('shop')} style={{ background: '#ff8c00' }}>🛒 МАГАЗИН</Button>
              <Button stretched mode="secondary" onClick={() => setCurrentScreen('tank')} style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.5)', color: 'white' }}>🐟 САДОК ({fishTank.length}/{tankCapacity})</Button>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <Button stretched mode="secondary" onClick={() => setCurrentScreen('inventory')} style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.5)', color: 'white' }}>📦 СКЛАД</Button>
              <Button stretched mode="secondary" onClick={() => setCurrentScreen('achievements')} style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.5)', color: 'white' }}>🏆 ДОСТИЖЕНИЯ</Button>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <Button stretched mode="secondary" onClick={() => setCurrentScreen('collection')} style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.5)', color: 'white' }}>📔 КОЛЛЕКЦИЯ ({collectedCount}/{totalFish})</Button>
              <Button stretched mode="secondary" onClick={() => setCurrentScreen('profile')} style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.5)', color: 'white' }}>👤 ПРОФИЛЬ</Button>
            </div>
            <Button stretched mode="secondary" onClick={() => setCurrentScreen('donate')} style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.5)', color: 'white' }}>🚧 В РАЗРАБОТКЕ</Button>
            <Button stretched mode="secondary" onClick={() => alert('📧 По вопросам и предложениям:\nfishing.vk.game@gmail.com')} style={{ marginTop: '12px', background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.5)', color: 'white' }}>
              📧 ПОДДЕРЖКА
            </Button>
          </Div>
        </Group>
      </div>
    );
  }

  if (currentScreen === 'battlepass') {
    const seasonTimeLeft = getSeasonTimeLeft();
    const daysLeft = Math.floor(seasonTimeLeft / (24 * 3600000));
    const hoursLeft = Math.floor((seasonTimeLeft % (24 * 3600000)) / 3600000);
    const bpProgress = (battlePassXp / BATTLE_PASS_XP_PER_LEVEL) * 100;
    const seasonData = getBattlePassRewards(currentSeason);

    const getRewardText = (reward) => {
      if (!reward) return '-';
      switch (reward.type) {
        case 'coins': return `${reward.amount} 🪙`;
        case 'rod': return `🎣 ${reward.item.name}`;
        case 'reel': return `🔄 ${reward.item.name}`;
        case 'line': return `📿 ${reward.item.name}`;
        case 'hook': return `🪝 ${reward.item.name}`;
        case 'bait': return `🐛 ${reward.item.name} x${reward.amount}`;
        case 'feed': return `🍽️ ${reward.item.name} x${reward.amount}`;
        case 'double_coins': return `💎 x2 монет ${reward.duration}м`;
        case 'durability_shield': return `🛡️ Страховка ${reward.duration}м`;
        case 'tank_upgrade': return `📦 Садок +${reward.amount}`;
        case 'bite_time_boost': return `⏱️ Поклёвка -${reward.amount}%`;
        case 'rigging_universal': return `⚙️ Универсальная оснастка`;
        default: return reward.type;
      }
    };

    return (
      <div style={{ minHeight: '100vh', background: darkTheme ? '#0a0a0a' : 'linear-gradient(145deg, #0a4a6e, #1a6d8f)', padding: '16px' }}>
        <PanelHeader style={{ background: darkTheme ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)', color: 'white' }} before={<span style={{ cursor: 'pointer' }} onClick={() => setCurrentScreen('menu')}>←</span>}>🔥 БОЕВОЙ ПРОПУСК</PanelHeader>
        <Group><Div>
          <div style={{ background: battlePassPremium ? 'linear-gradient(135deg, #ff8c00, #ff4444)' : '#555', borderRadius: '20px', padding: '16px', marginBottom: '16px', textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '24px' }}>{getSeasonEmoji(currentSeason)} СЕЗОН {currentSeason + 1}: {getSeasonName(currentSeason)}</div>
            <div style={{ fontSize: '14px', marginTop: '4px' }}>Осталось: {daysLeft}д {hoursLeft}ч</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <span>Ур. {battlePassLevel}/{BATTLE_PASS_LEVELS}</span>
              <div style={{ flex: 1, background: '#333', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
                <div style={{ background: '#ffd700', width: `${bpProgress}%`, height: '100%' }} />
              </div>
              <span>{battlePassXp}/{BATTLE_PASS_XP_PER_LEVEL}</span>
            </div>
            {!battlePassPremium && <Button size="s" onClick={buyPremiumPass} style={{ background: '#ffd700', color: '#333', marginTop: '10px' }}>💎 КУПИТЬ ПРЕМИУМ {BATTLE_PASS_PREMIUM_COST} 🪙</Button>}
            {battlePassPremium && <div style={{ marginTop: '8px', color: '#ffd700' }}>💎 Премиум активен!</div>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '8px', fontWeight: 'bold', color: darkTheme ? 'white' : 'black' }}>
            <div style={{ textAlign: 'center' }}>🆓 БЕСПЛАТНО</div>
            <div style={{ textAlign: 'center' }}>💎 ПРЕМИУМ</div>
          </div>
          {Array.from({ length: 30 }, (_, i) => i + 1).map(level => {
            const freeReward = seasonData.free[level];
            const premReward = seasonData.premium[level];
            const isUnlocked = battlePassLevel >= level;
            const freeClaimed = battlePassClaimed.free.includes(level);
            const premClaimed = battlePassClaimed.premium.includes(level);
            return (
              <div key={level} style={{ 
                background: isUnlocked ? (darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)') : (darkTheme ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.2)'),
                borderRadius: '12px', padding: '6px', marginBottom: '4px', display: 'grid', gridTemplateColumns: '30px 1fr 1fr', gap: '4px', alignItems: 'center',
                opacity: isUnlocked ? 1 : 0.4
              }}>
                <div style={{ fontWeight: 'bold', textAlign: 'center', color: isUnlocked ? '#ffd700' : '#888', fontSize: '12px' }}>{level}</div>
                <div style={{ fontSize: '11px', color: darkTheme ? '#ccc' : '#333' }}>
                  {freeReward ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ flex: 1 }}>{getRewardText(freeReward)}</span>
                      {isUnlocked && !freeClaimed && <Button size="s" onClick={() => claimBattlePassReward(level, 'free')} style={{ background: '#4caf50', fontSize: '9px', padding: '2px 6px' }}>Взять</Button>}
                      {freeClaimed && <span style={{ color: '#4caf50', fontSize: '12px' }}>✓</span>}
                    </div>
                  ) : <span style={{ color: '#888' }}>-</span>}
                </div>
                <div style={{ fontSize: '11px', color: '#ffd700' }}>
                  {premReward ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ flex: 1 }}>{getRewardText(premReward)}</span>
                      {isUnlocked && !premClaimed && battlePassPremium && <Button size="s" onClick={() => claimBattlePassReward(level, 'premium')} style={{ background: '#ff8c00', color: '#fff', fontSize: '9px', padding: '2px 6px' }}>Взять</Button>}
                      {premClaimed && <span style={{ color: '#ffd700', fontSize: '12px' }}>✓</span>}
                      {!battlePassPremium && <span style={{ color: '#888', fontSize: '10px' }}>🔒</span>}
                    </div>
                  ) : <span style={{ color: '#888' }}>-</span>}
                </div>
              </div>
            );
          })}
          <Spacing size={20} />
          <Button stretched mode="secondary" onClick={() => setCurrentScreen('menu')}>← Назад в меню</Button>
        </Div></Group>
      </div>
    );
  }

  if (currentScreen === 'inventory') {
    const activeRodData = getActiveRodData();
    const activeLineData = getActiveLineData();
    const activeReelData = getActiveReelData();
    const activeHookData = getActiveHookData();
    const activeRiggingData = getActiveRiggingData();
    return (
      <div style={{ minHeight: '100vh', background: darkTheme ? '#0a0a0a' : 'linear-gradient(145deg, #0a4a6e, #1a6d8f)', padding: '16px' }}>
        <PanelHeader style={{ background: darkTheme ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)', color: 'white' }} before={<span style={{ cursor: 'pointer' }} onClick={() => setCurrentScreen('menu')}>←</span>}>📦 СКЛАД</PanelHeader>
        <Group><Div>
          <div style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
            <Title level="3">Активная экипировка</Title>
            <Spacing size={8} />
            <SimpleCell>🎣 Удочка: {activeRodData?.name} ({getRodDurability()}%)</SimpleCell>
            <SimpleCell>📿 Леска: {activeLineData?.name} ({getLineDurability()}%)</SimpleCell>
            <SimpleCell>🔄 Катушка: {activeReelData?.name} ({getReelDurability()}%)</SimpleCell>
            <SimpleCell>🪝 Крючок: {activeHookData?.name} ({getHookDurability()}%)</SimpleCell>
            <SimpleCell>⚙️ Оснастка: {activeRiggingData?.name} (макс {activeRiggingData?.maxDistance}м)</SimpleCell>
            <SimpleCell>🐛 Наживка: {activeBait ? BAITS.find(b => b.id === activeBait)?.name : 'нет'}</SimpleCell>
            <SimpleCell>🍽️ Прикормка: {activeFeed ? FEEDS.find(f => f.id === activeFeed)?.name : 'нет'}</SimpleCell>
          </div>
          <Title level="3">🎣 Удочки ({rods.length} шт)</Title>
          {RODS.map(rodData => {
            const ownedRods = rods.filter(r => r.id === rodData.id);
            if (ownedRods.length === 0) return null;
            return ownedRods.map((rod, idx) => (
              <div key={`${rod.id}-${idx}`} style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><div style={{ fontWeight: 'bold' }}>{rodData.name} #{idx+1}</div><div style={{ fontSize: '11px' }}>Прочность: {rod.durability}%</div></div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {activeRod !== rod.id && <Button size="s" onClick={() => equipItem('rod', rod.id)}>Экип.</Button>}
                  {rods.length > 1 && <Button size="s" mode="destructive" onClick={() => confirmSellItem('rod', rod.id, rodData.name, rods.indexOf(rod), Math.floor(rodData.price * 0.5))}>Продать</Button>}
                </div>
              </div>
            ));
          })}
          <Title level="3">📿 Лески ({lines.length} шт)</Title>
          {LINES.map(lineData => {
            const ownedLines = lines.filter(l => l.id === lineData.id);
            if (ownedLines.length === 0) return null;
            return ownedLines.map((line, idx) => (
              <div key={`${line.id}-${idx}`} style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><div style={{ fontWeight: 'bold' }}>{lineData.name} #{idx+1}</div><div style={{ fontSize: '11px' }}>Прочность: {line.durability}%</div></div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {activeLine !== line.id && <Button size="s" onClick={() => equipItem('line', line.id)}>Экип.</Button>}
                  {lines.length > 1 && <Button size="s" mode="destructive" onClick={() => confirmSellItem('line', line.id, lineData.name, lines.indexOf(line), Math.floor(lineData.price * 0.5))}>Продать</Button>}
                </div>
              </div>
            ));
          })}
          <Title level="3">🔄 Катушки ({reels.length} шт)</Title>
          {REELS.map(reelData => {
            const ownedReels = reels.filter(r => r.id === reelData.id);
            if (ownedReels.length === 0) return null;
            return ownedReels.map((reel, idx) => (
              <div key={`${reel.id}-${idx}`} style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><div style={{ fontWeight: 'bold' }}>{reelData.name} #{idx+1}</div><div style={{ fontSize: '11px' }}>Прочность: {reel.durability}%</div></div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {activeReel !== reel.id && <Button size="s" onClick={() => equipItem('reel', reel.id)}>Экип.</Button>}
                  {reels.length > 1 && <Button size="s" mode="destructive" onClick={() => confirmSellItem('reel', reel.id, reelData.name, reels.indexOf(reel), Math.floor(reelData.price * 0.5))}>Продать</Button>}
                </div>
              </div>
            ));
          })}
          <Title level="3">🪝 Крючки ({hooks.length} шт)</Title>
          {HOOKS.map(hookData => {
            const ownedHooks = hooks.filter(h => h.id === hookData.id);
            if (ownedHooks.length === 0) return null;
            return ownedHooks.map((hook, idx) => (
              <div key={`${hook.id}-${idx}`} style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><div style={{ fontWeight: 'bold' }}>{hookData.name} #{idx+1}</div><div style={{ fontSize: '11px' }}>Прочность: {hook.durability}%</div></div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {activeHook !== hook.id && <Button size="s" onClick={() => equipItem('hook', hook.id)}>Экип.</Button>}
                  {hooks.length > 1 && <Button size="s" mode="destructive" onClick={() => confirmSellItem('hook', hook.id, hookData.name, hooks.indexOf(hook), Math.floor(hookData.price * 0.5))}>Продать</Button>}
                </div>
              </div>
            ));
          })}
          <Title level="3">⚙️ Оснастка</Title>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {RIGGINGS.map(rig => (
              <Button key={rig.id} mode={activeRigging === rig.id ? 'primary' : 'secondary'} size="s" onClick={() => equipItem('rigging', rig.id)} style={{ background: activeRigging === rig.id ? '#4caf50' : undefined }}>{rig.name} ({rig.maxDistance}м)</Button>
            ))}
          </div>
          <Title level="3">🐛 Наживки ({baits.length} шт)</Title>
          {BAITS.map(baitData => {
            const count = baits.filter(b => b.id === baitData.id).length;
            if (count === 0) return null;
            return (
              <div key={baitData.id} style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><div style={{ fontWeight: 'bold' }}>{baitData.name}</div><div style={{ fontSize: '11px' }}>Кол-во: {count}</div></div>
                <Button size="s" onClick={() => equipItem('bait', baitData.id)}>Экип.</Button>
              </div>
            );
          })}
          <Title level="3">🍽️ Прикормки ({feeds.length} шт)</Title>
          {FEEDS.map(feedData => {
            const count = feeds.filter(f => f.id === feedData.id).length;
            if (count === 0) return null;
            return (
              <div key={feedData.id} style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><div style={{ fontWeight: 'bold' }}>{feedData.name}</div><div style={{ fontSize: '11px' }}>Кол-во: {count}</div></div>
                <Button size="s" onClick={() => equipItem('feed', feedData.id)}>Экип.</Button>
              </div>
            );
          })}
          <Spacing size={16} />
          <Button stretched mode="secondary" onClick={() => setCurrentScreen('menu')}>← Назад в меню</Button>
          {confirmSell.show && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div style={{ background: darkTheme ? '#333' : '#fff', borderRadius: '16px', padding: '20px', width: '280px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', marginBottom: '16px', color: darkTheme ? 'white' : 'black' }}>⚠️ Подтверждение</div>
                <div style={{ marginBottom: '20px', color: darkTheme ? 'white' : 'black' }}>Продать <b>{confirmSell.itemName}</b> за <b>{confirmSell.price} 🪙</b>?</div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button stretched onClick={executeSell} style={{ background: '#4caf50' }}>✅ Да</Button>
                  <Button stretched mode="secondary" onClick={() => setConfirmSell({ show: false, type: null, itemId: null, itemName: null, index: null, price: null })}>❌ Нет</Button>
                </div>
              </div>
            </div>
          )}
        </Div></Group>
      </div>
    );
  }

  if (currentScreen === 'gear') {
    const activeRodData = getActiveRodData();
    const activeLineData = getActiveLineData();
    const activeReelData = getActiveReelData();
    const activeHookData = getActiveHookData();
    const activeRiggingData = getActiveRiggingData();
    return (
      <div style={{ minHeight: '100vh', background: darkTheme ? '#0a0a0a' : 'linear-gradient(145deg, #0a4a6e, #1a6d8f)', padding: '16px' }}>
        <PanelHeader style={{ background: darkTheme ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)', color: 'white' }} before={<span style={{ cursor: 'pointer' }} onClick={goToMenu}>←</span>}>
          ⚙️ ВЫБОР СНАРЯЖЕНИЯ {getTimeEmoji()} {getTimeName()}
        </PanelHeader>
        <Group><Div>
          <div style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
            <Title level="3">Твоя экипировка</Title>
            <Spacing size={8} />
            <SimpleCell>🎣 Удочка: {activeRodData?.name} ({getRodDurability()}%)</SimpleCell>
            <SimpleCell>📿 Леска: {activeLineData?.name} ({getLineDurability()}%)</SimpleCell>
            <SimpleCell>🔄 Катушка: {activeReelData?.name} ({getReelDurability()}%)</SimpleCell>
            <SimpleCell>🪝 Крючок: {activeHookData?.name} ({getHookDurability()}%)</SimpleCell>
            <SimpleCell>⚙️ Оснастка: {activeRiggingData?.name} (макс {activeRiggingData?.maxDistance}м)</SimpleCell>
            <SimpleCell>🐛 Наживка: {activeBait ? BAITS.find(b => b.id === activeBait)?.name : 'нет'}</SimpleCell>
            <SimpleCell>🍽️ Прикормка: {activeFeed ? FEEDS.find(f => f.id === activeFeed)?.name : 'нет'}</SimpleCell>
            <Spacing size={16} />
            <Button stretched onClick={() => setCurrentScreen('inventory')} mode="secondary">📦 Изменить экипировку</Button>
          </div>
          <Button stretched onClick={startFishingWithGear} style={{ background: '#4caf50', marginBottom: '12px' }}>✅ НАЧАТЬ РЫБАЛКУ</Button>
          <Button stretched mode="secondary" onClick={goToMenu}>← Отмена</Button>
        </Div></Group>
      </div>
    );
  }

  if (currentScreen === 'shop') {
    return (
      <div style={{ minHeight: '100vh', background: darkTheme ? '#0a0a0a' : 'linear-gradient(145deg, #0a4a6e, #1a6d8f)', padding: '16px' }}>
        <PanelHeader style={{ background: darkTheme ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)', color: 'white' }} before={<span style={{ cursor: 'pointer' }} onClick={() => setCurrentScreen('menu')}>←</span>}>🛒 МАГАЗИН</PanelHeader>
        <Group><Div>
          <div style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', borderRadius: '24px', padding: '20px', marginBottom: '20px', textAlign: 'center', color: darkTheme ? 'white' : 'black' }}>
            <div style={{ fontSize: '32px' }}>🪙 {totalPrice} монет</div>
          </div>
          <Title level="3" style={{ color: darkTheme ? 'white' : 'black', marginBottom: '16px' }}>🎣 Удочки</Title>
          {RODS.map(rod => (
            <div key={rod.id} style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: darkTheme ? 'white' : 'black' }}>
              <div><div style={{ fontWeight: 'bold' }}>{rod.name}</div><div style={{ fontSize: '11px' }}>Скорость x{rod.speed} | Прочность: {rod.durabilityMax}%</div></div>
              <Button size="s" onClick={() => buyItem('rod', rod, rod.price)} disabled={totalPrice < rod.price}>{rod.price === 0 ? 'Бесплатно' : `${rod.price} 🪙`}</Button>
            </div>
          ))}
          <Title level="3" style={{ color: darkTheme ? 'white' : 'black', marginTop: '20px', marginBottom: '16px' }}>📿 Лески</Title>
          {LINES.map(line => (
            <div key={line.id} style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: darkTheme ? 'white' : 'black' }}>
              <div><div style={{ fontWeight: 'bold' }}>{line.name}</div><div style={{ fontSize: '11px' }}>Прочность {line.strength}% | Макс: {line.durabilityMax}%</div></div>
              <Button size="s" onClick={() => buyItem('line', line, line.price)} disabled={totalPrice < line.price}>{line.price === 0 ? 'Бесплатно' : `${line.price} 🪙`}</Button>
            </div>
          ))}
          <Title level="3" style={{ color: darkTheme ? 'white' : 'black', marginTop: '20px', marginBottom: '16px' }}>🔄 Катушки</Title>
          {REELS.map(reel => (
            <div key={reel.id} style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: darkTheme ? 'white' : 'black' }}>
              <div><div style={{ fontWeight: 'bold' }}>{reel.name}</div><div style={{ fontSize: '11px' }}>Скорость x{reel.speed} | Прочность: {reel.durabilityMax}%</div></div>
              <Button size="s" onClick={() => buyItem('reel', reel, reel.price)} disabled={totalPrice < reel.price}>{reel.price === 0 ? 'Бесплатно' : `${reel.price} 🪙`}</Button>
            </div>
          ))}
          <Title level="3" style={{ color: darkTheme ? 'white' : 'black', marginTop: '20px', marginBottom: '16px' }}>🪝 Крючки</Title>
          {HOOKS.map(hook => (
            <div key={hook.id} style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: darkTheme ? 'white' : 'black' }}>
              <div><div style={{ fontWeight: 'bold' }}>{hook.name}</div><div style={{ fontSize: '11px' }}>Шанс редкой +{hook.bonusRare}% | Прочность: {hook.durabilityMax}%</div></div>
              <Button size="s" onClick={() => buyItem('hook', hook, hook.price)} disabled={totalPrice < hook.price}>{hook.price === 0 ? 'Бесплатно' : `${hook.price} 🪙`}</Button>
            </div>
          ))}
          <Title level="3" style={{ color: darkTheme ? 'white' : 'black', marginTop: '20px', marginBottom: '16px' }}>⚙️ Оснастка</Title>
          {RIGGINGS.map(rig => {
            const owned = riggings.includes(rig.id);
            return (
              <div key={rig.id} style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: darkTheme ? 'white' : 'black' }}>
                <div><div style={{ fontWeight: 'bold' }}>{rig.name}</div><div style={{ fontSize: '11px' }}>{rig.desc} | Макс {rig.maxDistance}м</div></div>
                {owned ? <span style={{ background: '#4caf50', color: 'white', padding: '6px 16px', borderRadius: '30px' }}>Есть</span> : <Button size="s" onClick={() => buyItem('rigging', rig, rig.price)} disabled={totalPrice < rig.price}>{rig.price} 🪙</Button>}
              </div>
            );
          })}
          <Title level="3" style={{ color: darkTheme ? 'white' : 'black', marginTop: '20px', marginBottom: '16px' }}>🐛 Наживки</Title>
          {BAITS.map(bait => (
            <div key={bait.id} style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: darkTheme ? 'white' : 'black' }}>
              <div><div style={{ fontWeight: 'bold' }}>{bait.name}</div><div style={{ fontSize: '11px' }}>Привлекает: {bait.target} | Редкость +{bait.bonusRare}%</div></div>
              <Button size="s" onClick={() => buyItem('bait', bait, bait.price)} disabled={totalPrice < bait.price}>{bait.price} 🪙</Button>
            </div>
          ))}
          <Title level="3" style={{ color: darkTheme ? 'white' : 'black', marginTop: '20px', marginBottom: '16px' }}>🍽️ Прикормки</Title>
          {FEEDS.map(feed => (
            <div key={feed.id} style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: darkTheme ? 'white' : 'black' }}>
              <div><div style={{ fontWeight: 'bold' }}>{feed.name}</div><div style={{ fontSize: '11px' }}>{feed.desc}</div></div>
              <Button size="s" onClick={() => buyItem('feed', feed, feed.price)} disabled={totalPrice < feed.price}>{feed.price} 🪙</Button>
            </div>
          ))}
          <Spacing size={20} />
          <div style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', color: darkTheme ? 'white' : 'black' }}>
            <div><div style={{ fontWeight: 'bold' }}>Расширить садок</div><div style={{ fontSize: '11px' }}>Вместимость +5 рыб</div></div>
            <Button size="s" onClick={upgradeTank} disabled={totalPrice < tankCapacity * 50}>{tankCapacity * 50} 🪙</Button>
          </div>
          <div style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: darkTheme ? 'white' : 'black' }}>
            <div><div style={{ fontWeight: 'bold' }}>Лодка</div><div style={{ fontSize: '11px' }}>Открывает глубокое море</div></div>
            <Button size="s" onClick={buyBoat} disabled={hasBoat || totalPrice < 2000}>{hasBoat ? 'Есть' : '2000 🪙'}</Button>
          </div>
          <Spacing size={20} />
          <Button stretched mode="secondary" onClick={() => setCurrentScreen('menu')}>← Назад в меню</Button>
        </Div></Group>
      </div>
    );
  }

  if (currentScreen === 'tank') {
    const fishCounts = {};
    fishTank.forEach(f => { fishCounts[f.name] = (fishCounts[f.name] || 0) + 1; });
    return (
      <div style={{ minHeight: '100vh', background: darkTheme ? '#0a0a0a' : 'linear-gradient(145deg, #0a4a6e, #1a6d8f)', padding: '16px' }}>
        <PanelHeader style={{ background: darkTheme ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)', color: 'white' }} before={<span style={{ cursor: 'pointer' }} onClick={() => setCurrentScreen('menu')}>←</span>}>🐟 САДОК ({fishTank.length}/{tankCapacity})</PanelHeader>
        <Group><Div>
          {fishTank.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.5)', borderRadius: '24px', color: 'white' }}>
              <div style={{ fontSize: '48px' }}>🐟</div><Text>Садок пуст</Text>
            </div>
          ) : (
            <>
              {fishTank.map(fish => (
                <div key={fish.id} style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: darkTheme ? 'white' : 'black' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '32px' }}>{fish.emoji}</div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{fish.name}</div>
                      <div style={{ fontSize: '11px', color: darkTheme ? '#aaa' : '#666' }}>{fish.weight} кг — {fish.price} 🪙</div>
                      {fishCounts[fish.name] >= 5 && <Button size="s" onClick={() => exchangeFish(fish.name)} style={{ marginTop: '4px', fontSize: '10px' }}>Обменять 5 шт</Button>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button size="s" onClick={() => startAuction(fish)} style={{ background: '#ff8c00' }}>Аук</Button>
                    <Button size="s" onClick={() => sellFromTank(fish.id, fish.price)} style={{ background: '#4caf50' }}>Продать</Button>
                  </div>
                </div>
              ))}
              <Spacing size={16} />
              <Button stretched onClick={sellAllFromTank} style={{ background: '#ff8c00', marginBottom: '12px' }}>💰 ПРОДАТЬ ВСЁ</Button>
              <Button stretched mode="secondary" onClick={() => setCurrentScreen('menu')}>← Назад</Button>
            </>
          )}
        </Div></Group>
      </div>
    );
  }

  if (currentScreen === 'profile') {
    const collectedCount = Object.keys(fishCollection).length;
    const totalFish = Object.keys(FISH_BASE).length;
    return (
      <div style={{ minHeight: '100vh', background: darkTheme ? '#0a0a0a' : 'linear-gradient(145deg, #0a4a6e, #1a6d8f)', padding: '16px' }}>
        <PanelHeader style={{ background: darkTheme ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)', color: 'white' }} before={<span style={{ cursor: 'pointer' }} onClick={() => setCurrentScreen('menu')}>←</span>}>👤 ПРОФИЛЬ</PanelHeader>
        <Group><Div>
          <div style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', borderRadius: '24px', padding: '20px', marginBottom: '20px', color: darkTheme ? 'white' : 'black' }}>
            <Title level="2" style={{ textAlign: 'center' }}>Статистика</Title>
            <Spacing size={16} />
            <SimpleCell before="🏆">Общий вес улова: <b>{totalWeight.toFixed(1)} кг</b></SimpleCell>
            <SimpleCell before="🪙">Всего монет: <b>{totalPrice}</b></SimpleCell>
            <SimpleCell before="🐟">Всего рыб: <b>{totalCatches}</b></SimpleCell>
            <SimpleCell before="⭐">Уровень: <b>{level}</b> ({xp}/{level*100} XP)</SimpleCell>
            <SimpleCell before="🌙">Ночных рыб: <b>{nightCatches}</b></SimpleCell>
            <SimpleCell before="⏱️">Бонус к поклёвке: <b>-{biteTimeReduction}%</b></SimpleCell>
            <Spacing size={16} />
            <Title level="3">Рекорды</Title>
            <Spacing size={8} />
            {bestCatch ? <SimpleCell before="🏅">Лучшая рыба: <b>{bestCatch.name}</b> — {bestCatch.weight} кг</SimpleCell> : <SimpleCell before="🏅">Пока нет</SimpleCell>}
            <SimpleCell before="📏">Макс. дальность: <b>{getMaxDistance()} м</b></SimpleCell>
            <Spacing size={16} />
            <Title level="3">Коллекция</Title>
            <Spacing size={8} />
            <SimpleCell before="📔">Поймано видов: <b>{collectedCount}/{totalFish}</b></SimpleCell>
            <div style={{ background: darkTheme ? '#333' : '#f0f0f0', borderRadius: '12px', padding: '8px', marginTop: '8px' }}>
              <div style={{ background: darkTheme ? '#555' : '#ccc', borderRadius: '10px', height: '12px', overflow: 'hidden' }}>
                <div style={{ background: '#4caf50', width: `${(collectedCount / totalFish) * 100}%`, height: '100%' }} />
              </div>
            </div>
            <Spacing size={16} />
            <Title level="3">🎁 Промокод</Title>
            <Spacing size={8} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                value={promoInput} 
                onChange={e => setPromoInput(e.target.value)}
                placeholder="Введи промокод"
                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', background: darkTheme ? '#333' : '#fff', color: darkTheme ? '#fff' : '#000' }}
              />
              <Button size="s" onClick={usePromo}>Активировать</Button>
            </div>
          </div>
          <Button stretched mode="secondary" onClick={() => setCurrentScreen('menu')}>← Назад в меню</Button>
        </Div></Group>
      </div>
    );
  }

  if (currentScreen === 'collection') {
    const collectedCount = Object.keys(fishCollection).length;
    const totalFish = Object.keys(FISH_BASE).length;
    return (
      <div style={{ minHeight: '100vh', background: darkTheme ? '#0a0a0a' : 'linear-gradient(145deg, #0a4a6e, #1a6d8f)', padding: '16px' }}>
        <PanelHeader style={{ background: darkTheme ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)', color: 'white' }} before={<span style={{ cursor: 'pointer' }} onClick={() => setCurrentScreen('menu')}>←</span>}>📔 КОЛЛЕКЦИЯ ({collectedCount}/{totalFish})</PanelHeader>
        <Group><Div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
            {Object.entries(FISH_BASE).map(([name, fish]) => {
              const isCaught = fishCollection[name];
              return (
                <div key={name} style={{ background: isCaught ? 'rgba(76,175,80,0.9)' : (darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.5)'), borderRadius: '16px', padding: '12px', textAlign: 'center', opacity: isCaught ? 1 : 0.5 }}>
                  <div style={{ fontSize: '40px', filter: isCaught ? 'none' : 'grayscale(1)' }}>{fish.emoji}</div>
                  <div style={{ fontSize: '12px', color: 'white', marginTop: '8px' }}>{name}</div>
                  <div style={{ fontSize: '10px', color: '#ccc' }}>{fish.weight} кг {fish.nightOnly ? '🌙' : ''}</div>
                </div>
              );
            })}
          </div>
          {collectedCount === totalFish && !collectionRewardClaimed && (
            <div style={{ marginTop: '20px', textAlign: 'center', background: '#ffd700', padding: '12px', borderRadius: '16px' }}>🎉 ПОЛНАЯ КОЛЛЕКЦИЯ! +2000 🪙</div>
          )}
          <Spacing size={20} />
          <Button stretched mode="secondary" onClick={() => setCurrentScreen('menu')}>← Назад</Button>
        </Div></Group>
      </div>
    );
  }

  if (currentScreen === 'achievements') {
    return (
      <div style={{ minHeight: '100vh', background: darkTheme ? '#0a0a0a' : 'linear-gradient(145deg, #0a4a6e, #1a6d8f)', padding: '16px' }}>
        <PanelHeader style={{ background: darkTheme ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)', color: 'white' }} before={<span style={{ cursor: 'pointer' }} onClick={() => setCurrentScreen('menu')}>←</span>}>🏆 ДОСТИЖЕНИЯ</PanelHeader>
        <Group><Div>
          {achievements.map(ach => (
            <div key={ach.id} style={{ background: ach.completed ? 'rgba(76,175,80,0.9)' : (darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)'), borderRadius: '16px', padding: '12px', marginBottom: '10px', color: ach.completed ? 'white' : (darkTheme ? 'white' : 'black') }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><div style={{ fontWeight: 'bold' }}>{ach.name}</div><div style={{ fontSize: '11px', color: ach.completed ? '#ddd' : (darkTheme ? '#aaa' : '#666') }}>{ach.desc}</div></div>
                <div>{ach.completed ? <span style={{ color: '#ffd700', fontSize: '20px' }}>✓ {ach.reward}</span> : <span style={{ fontSize: '12px' }}>{ach.progress}/{ach.target}</span>}</div>
              </div>
            </div>
          ))}
          <Spacing size={20} />
          <Button stretched mode="secondary" onClick={() => setCurrentScreen('menu')}>← Назад</Button>
        </Div></Group>
      </div>
    );
  }

  if (currentScreen === 'donate') {
    return (
      <div style={{ minHeight: '100vh', background: darkTheme ? '#0a0a0a' : 'linear-gradient(145deg, #0a4a6e, #1a6d8f)', padding: '16px' }}>
        <PanelHeader style={{ background: darkTheme ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)', color: 'white' }} before={<span style={{ cursor: 'pointer' }} onClick={() => setCurrentScreen('menu')}>←</span>}>💎 ДОНАТ</PanelHeader>
        <Group><Div>
          <div style={{ background: darkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', borderRadius: '24px', padding: '40px', textAlign: 'center', color: darkTheme ? 'white' : '#666' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🚧</div>
            <Title level="2">В РАЗРАБОТКЕ</Title>
            <Text style={{ marginTop: '16px' }}>Скоро здесь что-то появится</Text>
          </div>
          <Spacing size={20} />
          <Button stretched mode="secondary" onClick={() => setCurrentScreen('menu')}>← Назад</Button>
        </Div></Group>
      </div>
    );
  }

  const currentLakeData = LAKES.find(l => l.id === currentLake);
  const currentRod = getActiveRodData();
  const currentLine = getActiveLineData();
  const currentReel = getActiveReelData();
  const currentHook = getActiveHookData();
  const currentRigging = getActiveRiggingData();
  const maxDist = getMaxDistance();
  const penalties = getDistancePenalties(castDistance);

  const getTensionColor = () => {
    if (lineTension < 40) return '#4caf50';
    if (lineTension < 70) return '#ffc107';
    return '#ff4444';
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundImage: `linear-gradient(rgba(0,0,0,${isNightTime() ? '0.7' : '0.4'}), rgba(0,0,0,${isNightTime() ? '0.8' : '0.6'})), url(${currentLakeData?.bgImage})`,
      backgroundSize: 'cover', backgroundPosition: 'center', padding: '16px'
    }}>
      <PanelHeader style={{ background: darkTheme ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)', color: 'white', backdropFilter: 'blur(10px)' }} before={<span style={{ cursor: 'pointer' }} onClick={goToMenu}>←</span>}>
        {currentLakeData?.name} {getTimeEmoji()} {WEATHERS[weather].icon}
      </PanelHeader>
      <Group style={{ background: 'transparent' }}>
        <Div>
          <div style={{ background: darkTheme ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', borderRadius: '32px', padding: '20px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', minHeight: '100px' }}>
              <div className={animation === 'cast' ? 'cast-animation' : ''} style={{ fontSize: '56px', filter: 'drop-shadow(2px 4px 6px black)' }}>🎣</div>
              <div className={animation === 'float' ? 'float-animation' : ''}>
                <div style={{ width: '38px', height: '38px', background: 'radial-gradient(circle at 35% 35%, #ff5555, #aa0000)', borderRadius: '50%', border: '2px solid #fff', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '16px', height: '16px', background: '#fff', borderRadius: '50%' }} />
                </div>
              </div>
              <div className={animation === 'reel' ? 'reel-animation' : ''} style={{ fontSize: '56px', filter: 'drop-shadow(2px 4px 6px black)' }}>🐟</div>
            </div>
            {animation === 'bite' && <div style={{ textAlign: 'center', marginTop: '10px' }}><span style={{ fontSize: '28px', color: '#ff4444', fontWeight: 'bold' }}>!!!</span></div>}
            {showFishShadow && currentFish && (
              <div style={{ textAlign: 'center', marginTop: '10px', animation: 'shadowRise 0.5s ease-out' }}>
                <div style={{ fontSize: '48px', opacity: 0.6 }}>{currentFish.emoji}</div>
                <div style={{ fontSize: '10px', color: '#aaa' }}>~{currentFish.weight} кг</div>
              </div>
            )}
          </div>
          {(gameState === 'idle' || gameState === 'waiting' || gameState === 'casting') && (
            <div style={{ marginBottom: '20px', background: darkTheme ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)', padding: '16px', borderRadius: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'white' }}>
                <span>📏 Дальность</span>
                <span>{Math.floor(castDistance)} / {maxDist} м</span>
              </div>
              <Slider min={0} max={maxDist} value={castDistance} onChange={setCastDistance} disabled={gameState !== 'idle'} />
              <div style={{ fontSize: '11px', color: '#ccc', textAlign: 'center', marginTop: '8px' }}>
                {WEATHERS[weather].name} {penalties.tensionBonus > 0 ? `⚠️ +${penalties.tensionBonus}% натяжения` : ''}
              </div>
            </div>
          )}
          {gameState === 'reeling' && currentFish && (
            <div style={{ marginBottom: '16px', background: darkTheme ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.6)', padding: '12px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px', color: 'white' }}>
                <span>Прогресс: {Math.floor(reelingProgress)}%</span>
                <span>Усталость: {Math.floor(fishFatigue)}%</span>
              </div>
              <div style={{ background: '#333', borderRadius: '10px', height: '12px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ background: '#4caf50', width: `${reelingProgress}%`, height: '100%' }} />
              </div>
              <div style={{ background: '#333', borderRadius: '10px', height: '12px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ background: '#ff9800', width: `${fishFatigue}%`, height: '100%' }} />
              </div>
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px', color: 'white' }}>
                  <span>Натяжение: {Math.floor(lineTension)}%</span>
                  <span style={{ color: getTensionColor() }}>{lineTension < 40 ? 'Безопасно' : lineTension < 70 ? 'Осторожно' : 'Рвётся!'}</span>
                </div>
                <div style={{ background: '#333', borderRadius: '10px', height: '12px', overflow: 'hidden' }}>
                  <div style={{ background: getTensionColor(), width: `${lineTension}%`, height: '100%' }} />
                </div>
              </div>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            <div style={{ background: darkTheme ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)', borderRadius: '16px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '24px' }}>🪙</div><div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffeaac' }}>{totalPrice}</div></div>
            <div style={{ background: darkTheme ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)', borderRadius: '16px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '24px' }}>🐟</div><div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffeaac' }}>{totalCatches}</div></div>
            <div style={{ background: darkTheme ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)', borderRadius: '16px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '24px' }}>⭐</div><div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffeaac' }}>{level}</div></div>
          </div>
          <div style={{ background: darkTheme ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)', borderRadius: '20px', padding: '10px', marginBottom: '16px', display: 'flex', justifyContent: 'space-around', fontSize: '11px', color: 'white' }}>
            <span>🎣 {currentRod?.name.split(' ')[0]}</span>
            <span>📿 {currentLine?.name.split(' ')[0]}</span>
            <span>🔄 {currentReel?.name.split(' ')[0]}</span>
            <span>🪝 {currentHook?.name.split(' ')[0]}</span>
            <span>⚙️ {currentRigging?.name.split(' ')[0]}</span>
          </div>
          <div style={{ background: darkTheme ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)', borderRadius: '20px', padding: '12px', marginBottom: '20px', textAlign: 'center', color: '#ffeaac', fontSize: '13px' }}>
            {message}
          </div>
          {gameState === 'idle' && <Button size="l" stretched onClick={castLine} style={{ background: '#ff8c00', fontWeight: 'bold', padding: '16px' }}>🎣 ЗАКИНУТЬ</Button>}
          {gameState === 'biting' && <><Button size="l" stretched onClick={hookFish} style={{ marginBottom: '12px', background: '#ff4444', fontWeight: 'bold', padding: '16px' }}>🎯 ПОДСЕЧЬ!</Button><Button size="m" stretched mode="secondary" onClick={missFish} style={{ background: darkTheme ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.7)', color: 'white' }}>😔 Упустить</Button></>}
          {gameState === 'waiting' && <><Button size="l" stretched disabled style={{ marginBottom: '12px', background: '#666', padding: '16px' }}>⏳ ЖДУ...</Button><Button size="m" stretched mode="secondary" onClick={recastLine} style={{ background: darkTheme ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.5)', color: 'white' }}>🔄 Перекинуть</Button></>}
          {gameState === 'casting' && <Button size="l" stretched disabled style={{ background: '#666', padding: '16px' }}>🎣 ЗАКИДЫВАЮ...</Button>}
          {gameState === 'reeling' && <div><Button size="l" stretched onClick={reelTick} style={{ background: '#4caf50', fontWeight: 'bold', padding: '20px', fontSize: '18px', marginBottom: '12px' }}>🎣 ТЯНИ!</Button><div style={{ fontSize: '11px', textAlign: 'center', color: '#ffcc00', background: darkTheme ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)', padding: '6px', borderRadius: '12px' }}>💡 Нажимай ритмично, не спамь</div></div>}
          {gameState === 'caught' && currentFish && <div><div style={{ background: darkTheme ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.7)', borderRadius: '24px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}><div style={{ fontSize: '64px' }}>{currentFish.emoji}</div><div style={{ fontWeight: 'bold', fontSize: '20px', color: '#ffeaac' }}>{currentFish.name}</div><div style={{ fontSize: '14px' }}>{currentFish.weight} кг — {currentFish.price} 🪙 +{currentFish.xp} XP</div></div><div style={{ display: 'flex', gap: '12px' }}><Button stretched onClick={releaseFish} style={{ background: '#666' }}>🌊 ОТПУСТИТЬ</Button><Button stretched onClick={addToTank} style={{ background: '#4caf50' }}>🐟 В САДОК</Button></div></div>}
        </Div>
      </Group>
      <style>{`
        @keyframes castAnimation { 0% { transform: translateX(0px); } 50% { transform: translateX(-60px) rotate(-30deg); } 100% { transform: translateX(0px); } }
        @keyframes floatAnimation { 0% { transform: translateY(0px); } 50% { transform: translateY(-12px); } 100% { transform: translateY(0px); } }
        @keyframes reelAnimation { 0% { transform: translateX(0px); } 25% { transform: translateX(20px); } 50% { transform: translateX(-20px); } 100% { transform: translateX(0px); } }
        @keyframes shadowRise { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 0.6; } }
        .cast-animation { animation: castAnimation 0.5s ease-in-out; display: inline-block; }
        .float-animation { animation: floatAnimation 1.5s ease-in-out infinite; display: inline-block; }
        .reel-animation { animation: reelAnimation 0.5s ease-in-out infinite; display: inline-block; }
      `}</style>
    </div>
  );
}

export default App;