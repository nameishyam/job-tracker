import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeInUp,
} from "react-native-reanimated";

const AnimatedView = Animated.createAnimatedComponent(View);
const { width } = Dimensions.get("window");

const Landing = () => {
  const features = [
    {
      icon: "clipboard-outline",
      title: "Track Applications",
      description: "Keep all your job applications organized in one place",
    },
    {
      icon: "bar-chart-outline",
      title: "Monitor Progress",
      description: "Track interview rounds and application status",
    },
    {
      icon: "notifications-outline",
      title: "Stay Updated",
      description: "Never miss important deadlines or follow-ups",
    },
    {
      icon: "checkmark-circle-outline",
      title: "Achieve Goals",
      description: "Land your dream job with better organization",
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.mainGrid}>
          {/* Left Column - Hero Content */}
          <AnimatedView
            entering={FadeInLeft.duration(600)}
            style={styles.leftColumn}
          >
            <View style={styles.heroSection}>
              <Text style={styles.mainTitle}>
                Track Every Job{"\n"}
                <Text style={styles.gradientText}>Application</Text>
              </Text>
            </View>

            <View style={styles.descriptionSection}>
              <Text style={styles.description}>
                Organize your job search with our intuitive tracker. Monitor
                applications, track interview rounds, and stay on top of your
                career journey.
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <Link href="/signup" asChild>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                </TouchableOpacity>
              </Link>

              <Link href="/login" asChild>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </AnimatedView>

          {/* Right Column - Features Grid */}
          <AnimatedView
            entering={FadeInRight.duration(600).delay(200)}
            style={styles.rightColumn}
          >
            <View style={styles.featuresContainer}>
              {/* First Row - Track Applications & Monitor Progress */}
              <View style={styles.featuresRow}>
                {features.slice(0, 2).map((feature, index) => (
                  <AnimatedView
                    key={feature.title}
                    entering={FadeInUp.duration(400).delay(300 + index * 100)}
                    style={styles.featureCardWrapper}
                  >
                    <View style={styles.featureCard}>
                      <Ionicons
                        name={feature.icon as any}
                        size={24}
                        color="#16a34a"
                        style={styles.featureIcon}
                      />
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      <Text style={styles.featureDescription}>
                        {feature.description}
                      </Text>
                    </View>
                  </AnimatedView>
                ))}
              </View>

              {/* Second Row - Stay Updated & Achieve Goals */}
              <View style={styles.featuresRow}>
                {features.slice(2, 4).map((feature, index) => (
                  <AnimatedView
                    key={feature.title}
                    entering={FadeInUp.duration(400).delay(500 + index * 100)}
                    style={styles.featureCardWrapper}
                  >
                    <View style={styles.featureCard}>
                      <Ionicons
                        name={feature.icon as any}
                        size={24}
                        color="#16a34a"
                        style={styles.featureIcon}
                      />
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      <Text style={styles.featureDescription}>
                        {feature.description}
                      </Text>
                    </View>
                  </AnimatedView>
                ))}
              </View>
            </View>
          </AnimatedView>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    maxWidth: 1280,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 48,
  },
  mainGrid: {
    flexDirection: width > 768 ? "row" : "column",
    alignItems: "center",
    gap: width > 768 ? 48 : 32,
  },
  leftColumn: {
    flex: 1,
    width: "100%",
  },
  rightColumn: {
    flex: 1,
    width: "100%",
  },
  heroSection: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: width > 768 ? 40 : 32,
    fontWeight: "bold",
    color: "#111827",
    lineHeight: width > 768 ? 48 : 40,
  },
  gradientText: {
    color: "#16a34a",
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontSize: 18,
    color: "#6b7280",
    lineHeight: 28,
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#16a34a",
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "500",
  },
  // Updated styles for 2x2 grid layout
  featuresContainer: {
    gap: 16,
  },
  featuresRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  featureCardWrapper: {
    flex: 1,
    maxWidth: "48%",
  },
  featureCard: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    minHeight: 120, // Ensures consistent card height
  },
  featureIcon: {
    marginBottom: 8,
  },
  featureTitle: {
    fontWeight: "600",
    color: "#111827",
    fontSize: 14,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 16,
  },
});

export default Landing;
