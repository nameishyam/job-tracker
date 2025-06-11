import { Link } from "expo-router";
import { View, Text, Pressable, ScrollView } from "react-native";
import {
  BellIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
} from "react-native-heroicons/outline";

const features = [
  {
    Icon: ClipboardDocumentListIcon,
    title: "Track Applications",
    description: "Keep all your job applications organized in one place",
  },
  {
    Icon: ChartBarIcon,
    title: "Monitor Progress",
    description: "Track interview rounds and application status",
  },
  {
    Icon: BellIcon,
    title: "Stay Updated",
    description: "Never miss important deadlines or follow-ups",
  },
  {
    Icon: CheckCircleIcon,
    title: "Achieve Goals",
    description: "Land your dream job with better organization",
  },
];

export default function Landing() {
  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-6 py-10">
      <View className="mb-10">
        <Text className="text-4xl font-bold text-gray-900 dark:text-white leading-tight">
          Track Every Job
        </Text>
        <Text className="text-4xl font-bold text-green-600">Application</Text>
        <Text className="text-base text-gray-600 dark:text-gray-300 mt-4">
          Organize your job search with our intuitive tracker. Monitor
          applications, track interview rounds, and stay on top of your career
          journey.
        </Text>
      </View>

      <View className="flex flex-row space-x-4 mb-8">
        <Link href="/signup" asChild>
          <Pressable className="flex-1 px-5 py-3 bg-green-600 rounded-lg items-center">
            <Text className="text-white font-medium">Get Started</Text>
          </Pressable>
        </Link>
        <Link href="/login" asChild>
          <Pressable className="flex-1 px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg items-center">
            <Text className="text-gray-700 dark:text-gray-200 font-medium">
              Sign In
            </Text>
          </Pressable>
        </Link>
      </View>

      <View className="grid grid-cols-2 gap-4">
        {features.map(({ Icon, title, description }) => (
          <View
            key={title}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <Icon size={24} color="#22c55e" className="mb-2" />
            <Text className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
              {title}
            </Text>
            <Text className="text-xs text-gray-600 dark:text-gray-300">
              {description}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
