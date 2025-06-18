import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    flex: 1,
  },
  hero: {
    backgroundColor: '#4f46e5',
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginLeft: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    color: '#e0e7ff',
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    margin: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  sectionTitleWhite: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 12,
    color: '#374151',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginHorizontal: 12,
  },
  cardItem: {
    width: '46%',
    marginBottom: 16,
    padding: 12,
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  roleBadge: {
    backgroundColor: '#3b82f6',
    // backgroundColor: '#000000',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginVertical: 6,
  },
  teamImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 12,
  },
  impactCard: {
    backgroundColor: '#4f46e5',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  impactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  impactItem: {
    alignItems: 'center',
    marginVertical: 8,
  },
  impactCount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  impactLabel: {
    color: '#c7d2fe',
  },
  contactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    flexWrap: 'wrap',
  },
  contactItem: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  ctaButton: {
    marginTop: 24,
    alignSelf: 'center',
  },
  tText:{
    marginLeft: 15,
  },
});
