import React from 'react';
import {View, ScrollView, Image, Linking} from 'react-native';
import {
  Users,
  Target,
  Heart,
  Award,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
} from 'lucide-react-native';
import Button from '../../../../components/common/Button/Button';
import Card from '../../../../components/common/Card/Card';
import {Text} from 'react-native';
import styles from './styles';

const AboutScreen = ({navigation}) => {
  const teamMembers = [
    {
      name: 'John Doe',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?...',
      description:
        'Passionate about creating meaningful content and building communities.',
    },
    {
      name: 'Jane Smith',
      role: 'Content Manager',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?...',
      description: 'Expert in content strategy and community engagement.',
    },
    {
      name: 'Mike Johnson',
      role: 'Lead Developer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?...',
      description:
        'Full-stack developer with a passion for clean code and user experience.',
    },
  ];

  const values = [
    {
      icon: <Target color="#2563eb" size={32} />,
      title: 'Our Mission',
      description:
        'To provide a platform where writers and readers can connect, share ideas, and inspire each other through meaningful content.',
    },
    {
      icon: <Heart color="#dc2626" size={32} />,
      title: 'Our Vision',
      description:
        'To become the leading platform for authentic storytelling and knowledge sharing in the digital age.',
    },
    {
      icon: <Users color="#16a34a" size={32} />,
      title: 'Our Team',
      description:
        'Building a diverse, inclusive community of writers, thinkers, and learners from around the world.',
    },
    {
      icon: <Award color="#7c3aed" size={32} />,
      title: 'Our Values',
      description:
        'Authenticity, creativity, respect, and continuous learning are at the core of everything we do.',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>About Our Blog</Text>
        <Text style={styles.heroSubtitle}>
          Welcome to our corner of the internet where stories come alive, ideas
          flourish, and communities thrive.
        </Text>
      </View>

      {/* Story Section */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Our Story</Text>
        <Text style={styles.paragraph}>
          Founded in 2024, our blog platform was born from a simple idea:
          everyone has a story worth telling...
        </Text>
        <Text style={styles.paragraph}>
          What started as a small project has grown into a vibrant community...
        </Text>
        <Text style={styles.paragraph}>
          Today, we're proud to host thousands of articles, stories, and
          insights...
        </Text>
      </Card>

      {/* Values Section */}
      <Text style={styles.sectionTitle}>What Drives Us</Text>
      <View style={styles.grid}>
        {values.map((val, index) => (
          <Card key={index} style={styles.cardItem}>
            <View style={styles.iconTitleRow}>
              {val.icon}
              <Text style={styles.cardTitle}>{val.title}</Text>
            </View>
            <Text style={styles.paragraph}>{val.description}</Text>
          </Card>
        ))}
      </View>

      {/* Team Section */}
      <Text style={styles.sectionTitle}>Meet Our Team</Text>
      <View style={styles.grid}>
        {teamMembers.map((member, index) => (
          <Card key={index} style={styles.cardItem}>
            <Image source={{uri: member.image}} style={styles.teamImage} />
            <Text style={styles.cardTitle}>{member.name}</Text>
            <Text style={styles.roleBadge}>{member.role}</Text>
            <Text style={styles.paragraph}>{member.description}</Text>
          </Card>
        ))}
      </View>

      {/* Impact Section */}
      <Card style={styles.impactCard}>
        <Text style={styles.sectionTitleWhite}>Our Impact</Text>
        <View style={styles.impactGrid}>
          <View style={styles.impactItem}>
            <Text style={styles.impactCount}>10K+</Text>
            <Text style={styles.impactLabel}> Published</Text>
          </View>
          <View style={styles.impactItem}>
            <Text style={styles.impactCount}>50K+</Text>
            <Text style={styles.impactLabel}>Active Readers</Text>
          </View>
          <View style={styles.impactItem}>
            <Text style={styles.impactCount}>5K+</Text>
            <Text style={styles.impactLabel}>Writers</Text>
          </View>
          <View style={styles.impactItem}>
            <Text style={styles.impactCount}>100+</Text>
            <Text style={styles.impactLabel}>Countries</Text>
          </View>
        </View>
      </Card>

      {/* Contact Section */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Get In Touch</Text>
        <View style={styles.contactGrid}>
          <View style={styles.contactItem}>
            <Mail color="#2563eb" size={32} />
            <Text style={styles.contactTitle}>Email Us</Text>
            <Text style={styles.tText}>contact@ourblog.com</Text>
          </View>
          <View style={styles.contactItem}>
            <Phone color="#16a34a" size={32} />
            <Text style={styles.contactTitle}>Call Us</Text>
            <Text style={styles.tText}>+1 (555) 123-4567</Text>
          </View>
          <View style={styles.contactItem}>
            <MapPin color="#dc2626" size={32} />
            <Text style={styles.contactTitle}>Visit Us</Text>
            <Text style={styles.tText}>123 Blog Street, Digital City</Text>
          </View>
        </View>

        <Button
          title="Join Our Community"
          onPress={() => navigation.navigate('Register')}
          style={styles.ctaButton}
        />
      </Card>
    </ScrollView>
  );
};

export default AboutScreen;
