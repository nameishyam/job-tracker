import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInLeft,
  FadeInUp,
  FadeOut,
} from "react-native-reanimated";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import JobCard from "../components/JobCard";
import JobForm from "../components/JobForm";

const AnimatedView = Animated.createAnimatedComponent(View);
const { width } = Dimensions.get("window");

interface Job {
  id: string;
  title: string;
  company: string;
  status: string;
  appliedDate: string;
  // Add other job properties as needed
}

const Dashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, token, logout } = useAuth();

  const fetchJobs = async () => {
    if (!token || !user) return;

    try {
      const response = await api.get("/users/jobs", {
        params: { email: user.email },
      });

      if (response.data.jobs && response.data.jobs.length > 0) {
        setJobs(response.data.jobs);
      } else {
        setJobs([]);
      }
    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        await logout();
        router.replace("/login");
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user, token]);

  const handleJobAdded = (newJob: Job) => {
    setJobs((prevJobs) => [...prevJobs, newJob]);
    setShowForm(false);
  };

  const handleJobDeleted = (deletedJobId: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== deletedJobId));
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Loading your applications...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Job Dashboard</Text>
            <Text style={styles.subtitle}>
              Track and manage your job applications
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowForm(!showForm)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="add"
              size={16}
              color="white"
              style={styles.addIcon}
            />
            <Text style={styles.addButtonText}>Add Job</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content Grid */}
        <View style={styles.mainGrid}>
          {/* Job Form Section */}
          {showForm && (
            <AnimatedView
              entering={FadeInLeft.duration(300)}
              exiting={FadeOut.duration(300)}
              style={styles.formSection}
            >
              <View style={styles.formCard}>
                <View style={styles.formHeader}>
                  <Text style={styles.formTitle}>Add New Job</Text>
                  <TouchableOpacity
                    onPress={() => setShowForm(false)}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={20} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
                <JobForm
                  email={user?.email}
                  onJobAdded={handleJobAdded}
                  token={token}
                />
              </View>
            </AnimatedView>
          )}

          {/* Jobs List Section */}
          <View
            style={[
              styles.jobsSection,
              showForm ? styles.jobsSectionWithForm : styles.jobsSectionFull,
            ]}
          >
            <View style={styles.jobsCard}>
              <View style={styles.jobsHeader}>
                <View style={styles.jobsHeaderContent}>
                  <Ionicons
                    name="briefcase-outline"
                    size={20}
                    color="#9ca3af"
                  />
                  <Text style={styles.jobsHeaderText}>
                    Your Applications ({jobs.length})
                  </Text>
                </View>
              </View>

              <View style={styles.jobsContent}>
                {jobs.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons
                      name="briefcase-outline"
                      size={48}
                      color="#d1d5db"
                      style={styles.emptyIcon}
                    />
                    <Text style={styles.emptyTitle}>No applications yet</Text>
                    <Text style={styles.emptyDescription}>
                      Start tracking your job applications by adding your first
                      one.
                    </Text>
                    <TouchableOpacity
                      style={styles.emptyButton}
                      onPress={() => setShowForm(true)}
                    >
                      <Ionicons name="add" size={16} color="white" />
                      <Text style={styles.emptyButtonText}>
                        Add Your First Job
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.jobsList}>
                    {jobs.map((job, index) => (
                      <AnimatedView
                        key={job.id}
                        entering={FadeInUp.duration(300).delay(index * 100)}
                        style={styles.jobCardWrapper}
                      >
                        <JobCard
                          job={job}
                          token={token}
                          onJobDeleted={handleJobDeleted}
                        />
                      </AnimatedView>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
  content: {
    maxWidth: 1280,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  header: {
    flexDirection: width > 640 ? "row" : "column",
    justifyContent: "space-between",
    alignItems: width > 640 ? "center" : "flex-start",
    marginBottom: 24,
    gap: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16a34a",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  addIcon: {
    marginRight: 0,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  mainGrid: {
    flexDirection: width > 1024 ? "row" : "column",
    gap: 24,
  },
  formSection: {
    flex: width > 1024 ? 1 : undefined,
    maxWidth: width > 1024 ? "33.333333%" : "100%",
  },
  formCard: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  jobsSection: {
    flex: 1,
  },
  jobsSectionWithForm: {
    maxWidth: width > 1024 ? "66.666667%" : "100%",
  },
  jobsSectionFull: {
    maxWidth: "100%",
  },
  jobsCard: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  jobsHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  jobsHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  jobsHeaderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  jobsContent: {
    padding: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 16,
  },
  emptyIcon: {
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111827",
  },
  emptyDescription: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    paddingHorizontal: 16,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16a34a",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  emptyButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  jobsList: {
    gap: 12,
  },
  jobCardWrapper: {
    width: "100%",
  },
});

export default Dashboard;
