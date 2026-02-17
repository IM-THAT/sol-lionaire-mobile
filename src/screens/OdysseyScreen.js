import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Animated, Linking, Alert,
  Dimensions, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useWallet } from '../context/WalletContext';
import { valueCalculator, PROPERTY_TIERS } from '../services/valueCalculator';
import { priceDataService } from '../services/pythPriceService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── 24K GOLD & MATTE BLACK PALETTE ──────────────────────────────────────────
const P = {
  black:     '#0A0A0A',
  charcoal:  '#141414',
  dark:      '#1C1C1C',
  mid:       '#2A2A2A',
  dim:       '#444444',
  gray:      '#888888',
  offWhite:  '#F5F0E8',
  gold:      '#C9A84C',
  goldLight: '#E8C96A',
  goldDeep:  '#A07830',
  goldGlow:  'rgba(201,168,76,0.12)',
  success:   '#2ECC71',
  info:      '#5DADE2',
};

// ── LUXURY NARRATIVE ─────────────────────────────────────────────────────────
const NARRATIVE = {
  manhole:    { headline: 'Every great empire began\nbeneath the surface.', subline: 'Your foundation is now set.' },
  bench:      { headline: 'Ascending from the depths.', subline: 'The vision of the skyline starts to take shape.' },
  parking:    { headline: 'Prime real estate in\nthe concrete jungle.', subline: 'You understand the value of position.' },
  studio:     { headline: 'A space of your own\nin the digital metropolis.', subline: 'The journey to the top has officially begun.' },
  onebedroom: { headline: 'The view is changing.', subline: "You're no longer just observing the market — you're occupying it." },
  luxury:     { headline: 'Luxury is becoming\nyour standard.', subline: 'The city lights reflect your growing influence.' },
  penthouse:  { headline: "You don't just live\nin the city.", subline: 'You look down upon it.' },
};

// ── UPGRADE PHRASES ──────────────────────────────────────────────────────────
const UPGRADE_PHRASES = [
  (tier, sol) => `The ${tier} is only ${sol} SOL away.\nWill you claim your view tonight?`,
  (tier, sol) => `Current market trends favor an upgrade.\nSecure ${tier} status before the tide shifts.`,
  (tier)      => `A mogul never waits.\nSecure your ${tier} tier with a quick swap.`,
];

const JUPITER_URL = 'https://jup.ag/swap/USDC-SOL';

export default function OdysseyScreen() {
  const { balance, isConnected } = useWallet();
  const [solPrice,     setSolPrice]     = useState(139.8);
  const [timeline,     setTimeline]     = useState([]);
  const [selectedPt,   setSelectedPt]   = useState(null);
  const [currentTier,  setCurrentTier]  = useState(null);
  const [upgradeInfo,  setUpgradeInfo]  = useState(null);
  const [city,         setCity]         = useState('MANHATTAN');
  const [phraseIdx]                     = useState(Math.floor(Math.random() * 3));

  const heroOpacity  = useRef(new Animated.Value(0)).current;
  const heroY        = useRef(new Animated.Value(24)).current;
  const cardOpacity  = useRef(new Animated.Value(0)).current;
  const cardY        = useRef(new Animated.Value(32)).current;
  const upOpacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => { loadData(); }, [balance, city]);

  const animateIn = () => {
    heroOpacity.setValue(0); heroY.setValue(24);
    cardOpacity.setValue(0); cardY.setValue(32);
    upOpacity.setValue(0);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(heroOpacity, { toValue:1, duration:800, useNativeDriver:true }),
        Animated.spring(heroY,       { toValue:0, friction:10,  useNativeDriver:true }),
      ]),
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue:1, duration:800, useNativeDriver:true }),
        Animated.spring(cardY,       { toValue:0, friction:10,  useNativeDriver:true }),
      ]),
      Animated.timing(upOpacity, { toValue:1, duration:600, useNativeDriver:true }),
    ]).start();
  };

  const loadData = async () => {
    try {
      const prices  = await priceDataService.fetchAllPrices(city);
      const price   = prices.solPrice || 139.8;
      setSolPrice(price);
      const sol     = balance || 2.0;

      const tl      = valueCalculator.generateOdysseyTimeline({ solAmount:sol, currentSolPrice:price, cityType:city, months:12 });
      setTimeline(tl);

      const current = valueCalculator.determineMapping({ solAmount:sol, solPrice:price, cityPricePerSqm: city==='MANHATTAN'?15000:8500, cityType:city });
      setCurrentTier(current.tier);

      const upgrade = valueCalculator.calculateUpgrade({ solAmount:sol, solPrice:price, cityType:city });
      setUpgradeInfo(upgrade);

      animateIn();
    } catch (e) { console.error('Odyssey load failed:', e); }
  };

  const handleJupiter = async () => {
    try {
      if (Platform.OS !== 'web') await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      const ok = await Linking.canOpenURL(JUPITER_URL);
      if (ok) await Linking.openURL(JUPITER_URL);
      else Alert.alert('Jupiter Swap', 'Opening Jupiter DEX...');
    } catch { Alert.alert('Error', 'Could not open Jupiter.'); }
  };

  const handlePoint = async (pt) => {
    if (Platform.OS !== 'web') await Haptics.selectionAsync();
    setSelectedPt(selectedPt?.date === pt.date ? null : pt);
  };

  const narrative = currentTier ? (NARRATIVE[currentTier.id] || NARRATIVE.manhole) : null;

  // ── TIMELINE CHART ───────────────────────────────────────────────────────
  const renderTimeline = () => {
    if (!timeline.length) return null;
    const past   = timeline.filter(t => t.isPast);
    const H      = 150;
    const PW     = 30;
    const maxIdx = PROPERTY_TIERS.length - 1;
    const totalW = PW * timeline.length + 24;

    return (
      <View style={{ position:'relative' }}>
        {/* Y-axis */}
        <View style={tc.yAxis}>
          {PROPERTY_TIERS.slice().reverse().map((t,i) => (
            <Text key={i} style={tc.yEmoji}>{t.emoji}</Text>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginRight:24 }}>
          <View style={{ width:totalW, height: H+30, position:'relative' }}>
            {/* Grid */}
            {PROPERTY_TIERS.map((_,i) => (
              <View key={i} style={[tc.grid, { bottom: 28+(i/maxIdx)*H }]} />
            ))}
            {/* Future divider */}
            <View style={[tc.divider, { left: PW*past.length }]} />

            {/* Points */}
            {timeline.map((pt, idx) => {
              const x    = idx * PW + 8;
              const y    = 28 + (pt.tierIndex / maxIdx) * H;
              const isCur = pt.isCurrent;
              const size  = isCur ? 14 : 10;
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handlePoint(pt)}
                  activeOpacity={0.7}
                  style={[tc.dot, {
                    left: x - size/2, bottom: y - size/2,
                    width:size, height:size, borderRadius:size/2,
                    backgroundColor: pt.isFuture ? 'transparent' : pt.tier.color,
                    borderWidth: pt.isFuture ? 1.5 : 0,
                    borderColor: pt.tier.color,
                  }]}
                >
                  {isCur && <View style={[tc.pulse, { borderColor: pt.tier.color }]} />}
                </TouchableOpacity>
              );
            })}

            {/* X labels */}
            <View style={tc.xRow}>
              {timeline.map((pt, idx) => (
                <View key={idx} style={{ width:PW, alignItems:'center' }}>
                  <Text style={[
                    tc.xLabel,
                    pt.isCurrent && { color: P.gold },
                    pt.isFuture  && { color: P.info, fontStyle:'italic' },
                  ]}>{pt.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  if (!isConnected) {
    return (
      <LinearGradient colors={[P.black, P.charcoal]} style={{flex:1,alignItems:'center',justifyContent:'center',padding:48}}>
        <Text style={{fontSize:56,marginBottom:20}}>🔗</Text>
        <Text style={{fontSize:22,color:P.offWhite,fontWeight:'600',marginBottom:12,letterSpacing:0.5}}>Connect Your Wallet</Text>
        <Text style={{fontSize:14,color:P.gray,textAlign:'center',lineHeight:22}}>Connect in Home tab to begin your Asset Odyssey.</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[P.black, P.charcoal]} style={{flex:1}}>

      {/* HEADER */}
      <LinearGradient colors={[P.charcoal, P.dark]} style={s.header}>
        <Text style={s.eyebrow}>ASSET ODYSSEY</Text>
        <Text style={s.headerTitle}>Your Wealth Journey</Text>
        <View style={s.toggle}>
          {['MANHATTAN','DUBAI'].map(c => (
            <TouchableOpacity key={c} style={[s.toggleBtn, city===c && s.toggleBtnActive]}
              onPress={() => { setCity(c); setSelectedPt(null); }}>
              <Text style={[s.toggleText, city===c && s.toggleTextActive]}>
                {c==='MANHATTAN' ? '🗽 NYC' : '🏙️ Dubai'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingBottom:60 }}>

        {/* HERO CARD */}
        {currentTier && narrative && (
          <Animated.View style={{ opacity:heroOpacity, transform:[{translateY:heroY}] }}>
            <LinearGradient colors={[P.dark, P.mid, P.dark]}
              style={[s.heroCard, { borderColor:currentTier.color }]}>
              <LinearGradient colors={[P.goldDeep, P.gold, P.goldLight, P.gold, P.goldDeep]}
                start={{x:0,y:0}} end={{x:1,y:0}} style={s.accentLine} />

              <Text style={{fontSize:56, marginBottom:20}}>{currentTier.emoji}</Text>
              <Text style={s.headline}>{narrative.headline}</Text>
              <Text style={s.subline}>{narrative.subline}</Text>

              <LinearGradient colors={['transparent', P.gold, 'transparent']}
                start={{x:0,y:0}} end={{x:1,y:0}} style={s.divider} />

              <Text style={s.heroValue}>
                ${((balance||2)*solPrice).toLocaleString(undefined,{maximumFractionDigits:0})}
              </Text>
              <Text style={s.heroValueLabel}>CURRENT PORTFOLIO VALUE</Text>
              <Text style={s.heroLocation}>{currentTier.location[city]}</Text>

              <View style={[s.rarityBadge, {borderColor:currentTier.color}]}>
                <Text style={[s.rarityText, {color:currentTier.color}]}>
                  {currentTier.rarity.toUpperCase()}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* TIMELINE */}
        <Animated.View style={{ opacity:cardOpacity, transform:[{translateY:cardY}] }}>
          <View style={s.section}>
            <Text style={s.eyebrow}>WEALTH TIMELINE</Text>
            <Text style={s.sectionTitle}>Past · Present · Future</Text>
            <View style={s.card}>{renderTimeline()}</View>
          </View>

          {/* TOOLTIP */}
          {selectedPt && (
            <View style={[s.tooltip, {borderColor:selectedPt.tier.color, marginHorizontal:16}]}>
              <LinearGradient colors={[P.dark, P.mid]} style={{padding:16, borderRadius:14}}>
                <Text style={[s.eyebrow, {color:selectedPt.tier.color, marginBottom:6}]}>{selectedPt.label}{selectedPt.isFuture ? '  · PROJECTION':''}</Text>
                <Text style={{fontSize:18,color:P.offWhite,fontWeight:'600',marginBottom:8}}>{selectedPt.tier.emoji}  {selectedPt.tier.name}</Text>
                <Text style={{fontSize:13,color:P.gray,marginBottom:4}}>SOL price  ·  ${selectedPt.solPrice.toFixed(2)}</Text>
                <Text style={{fontSize:15,color:P.gold,fontWeight:'600'}}>Portfolio  ·  ${selectedPt.usdValue.toLocaleString(undefined,{maximumFractionDigits:0})}</Text>
              </LinearGradient>
            </View>
          )}
        </Animated.View>

        {/* UPGRADE SIMULATOR */}
        {upgradeInfo?.nextTier && (
          <Animated.View style={{ opacity:upOpacity }}>
            <View style={s.section}>
              <Text style={s.eyebrow}>UPGRADE SIMULATOR</Text>
              <LinearGradient colors={[P.dark, '#1A160A']}
                style={[s.upgradeCard, {borderColor:upgradeInfo.nextTier.color}]}>

                <Text style={s.upgradePhrase}>
                  {UPGRADE_PHRASES[phraseIdx](upgradeInfo.nextTier.shortName, upgradeInfo.solNeeded.toFixed(2))}
                </Text>

                <View style={{flexDirection:'row',alignItems:'center',gap:12,marginBottom:16}}>
                  <Text style={{fontSize:36}}>{upgradeInfo.nextTier.emoji}</Text>
                  <View>
                    <Text style={s.eyebrow}>NEXT TIER</Text>
                    <Text style={{fontSize:18,color:P.offWhite,fontWeight:'600'}}>{upgradeInfo.nextTier.name}</Text>
                  </View>
                </View>

                {/* Progress bar */}
                <View style={s.progressBg}>
                  <LinearGradient colors={[P.goldDeep, P.gold, P.goldLight]}
                    start={{x:0,y:0}} end={{x:1,y:0}}
                    style={[s.progressFill, {width:`${upgradeInfo.progress}%`}]} />
                </View>
                <Text style={{fontSize:12,color:P.gray,marginBottom:24,letterSpacing:0.5}}>
                  {upgradeInfo.progress.toFixed(0)}%  ·  {upgradeInfo.solNeeded.toFixed(2)} SOL remaining
                </Text>

                {/* Jupiter Button */}
                <TouchableOpacity onPress={handleJupiter} activeOpacity={0.85} style={{borderRadius:14,overflow:'hidden',marginBottom:12}}>
                  <LinearGradient colors={[P.goldDeep, P.gold, P.goldLight]}
                    start={{x:0,y:0}} end={{x:1,y:0}}
                    style={{flexDirection:'row',alignItems:'center',justifyContent:'center',paddingVertical:16,gap:8}}>
                    <Text style={{fontSize:20}}>⚡</Text>
                    <Text style={{fontSize:16,fontWeight:'700',color:P.black,letterSpacing:0.5}}>Upgrade with Jupiter</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <Text style={{fontSize:11,color:P.dim,textAlign:'center',letterSpacing:0.5}}>
                  Powered by Jupiter DEX · Best rates on Solana
                </Text>
              </LinearGradient>
            </View>
          </Animated.View>
        )}

        {/* PROPERTY LADDER */}
        <View style={s.section}>
          <Text style={s.eyebrow}>PROPERTY LADDER</Text>
          {PROPERTY_TIERS.map((tier,idx) => {
            const isCur = currentTier?.id === tier.id;
            return (
              <LinearGradient key={idx}
                colors={isCur ? [P.dark,'#1A150A'] : [P.charcoal, P.charcoal]}
                style={[s.tierRow, {borderColor: isCur ? tier.color : P.mid}]}>
                <Text style={{fontSize:22,width:32,textAlign:'center'}}>{tier.emoji}</Text>
                <View style={{flex:1}}>
                  <Text style={{fontSize:14,color: isCur ? tier.color : P.offWhite,fontWeight:'500',marginBottom:2}}>
                    {tier.name}{isCur ? '  ← You are here':''}
                  </Text>
                  <Text style={{fontSize:11,color:P.gray}}>
                    ${tier.minUSD.toLocaleString()} – {tier.maxUSD===Infinity?'∞':`$${tier.maxUSD.toLocaleString()}`}
                  </Text>
                </View>
                <View style={{width:8,height:8,borderRadius:4,backgroundColor:tier.color}} />
              </LinearGradient>
            );
          })}
        </View>

        <View style={{height:40}} />
      </ScrollView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  header: { paddingTop:60,paddingBottom:20,paddingHorizontal:24,alignItems:'center',borderBottomWidth:1,borderBottomColor:P.gold },
  eyebrow: { fontSize:10,color:P.gold,letterSpacing:4,fontWeight:'600',marginBottom:4 },
  headerTitle: { fontSize:22,color:P.offWhite,fontWeight:'300',letterSpacing:1,marginBottom:16 },
  toggle: { flexDirection:'row',backgroundColor:P.black,borderRadius:12,padding:3,borderWidth:1,borderColor:P.mid },
  toggleBtn: { paddingVertical:8,paddingHorizontal:20,borderRadius:10 },
  toggleBtnActive: { backgroundColor:P.gold },
  toggleText: { fontSize:13,color:P.gray,fontWeight:'500' },
  toggleTextActive: { color:P.black,fontWeight:'700' },

  heroCard: { margin:16,borderRadius:20,borderWidth:1,padding:28,alignItems:'center',overflow:'hidden' },
  accentLine: { position:'absolute',top:0,left:0,right:0,height:2 },
  headline: { fontSize:22,color:P.offWhite,fontWeight:'300',textAlign:'center',lineHeight:32,marginBottom:12,letterSpacing:0.5 },
  subline: { fontSize:14,color:P.gray,textAlign:'center',fontStyle:'italic',lineHeight:20,marginBottom:24 },
  divider: { width:120,height:1,marginBottom:24 },
  heroValue: { fontSize:40,fontWeight:'700',color:P.gold,letterSpacing:1,marginBottom:4 },
  heroValueLabel: { fontSize:10,color:P.gray,letterSpacing:3,marginBottom:12 },
  heroLocation: { fontSize:13,color:P.gray,letterSpacing:1,marginBottom:20 },
  rarityBadge: { borderWidth:1,borderRadius:20,paddingVertical:5,paddingHorizontal:16 },
  rarityText: { fontSize:10,fontWeight:'700',letterSpacing:2 },

  section: { paddingHorizontal:16,marginTop:24 },
  sectionTitle: { fontSize:16,color:P.offWhite,fontWeight:'300',letterSpacing:0.5,marginBottom:12 },
  card: { backgroundColor:P.dark,borderRadius:16,padding:16,borderWidth:1,borderColor:P.mid,overflow:'hidden' },
  tooltip: { borderRadius:14,borderWidth:1,overflow:'hidden',marginTop:8 },

  upgradeCard: { borderRadius:20,borderWidth:1,padding:24 },
  upgradePhrase: { fontSize:15,color:P.offWhite,fontWeight:'300',lineHeight:24,letterSpacing:0.3,marginBottom:20,fontStyle:'italic' },
  progressBg: { height:6,backgroundColor:P.mid,borderRadius:3,marginBottom:8,overflow:'hidden' },
  progressFill: { height:'100%',borderRadius:3 },

  tierRow: { flexDirection:'row',alignItems:'center',borderRadius:14,padding:14,marginBottom:8,borderWidth:1,gap:12 },
});

const tc = StyleSheet.create({
  yAxis: { position:'absolute',right:0,top:0,bottom:30,width:24,justifyContent:'space-between',paddingVertical:4,alignItems:'center',backgroundColor:P.dark,zIndex:10 },
  yEmoji: { fontSize:8 },
  grid: { position:'absolute',left:0,right:24,height:1,backgroundColor:P.mid,opacity:0.5 },
  divider: { position:'absolute',top:0,bottom:30,width:1,backgroundColor:P.gold,opacity:0.4 },
  dot: { position:'absolute' },
  pulse: { position:'absolute',width:22,height:22,borderRadius:11,borderWidth:1.5,top:-4,left:-4,opacity:0.5 },
  xRow: { position:'absolute',bottom:0,left:0,right:0,flexDirection:'row' },
  xLabel: { fontSize:8,color:P.gray,textAlign:'center' },
});
