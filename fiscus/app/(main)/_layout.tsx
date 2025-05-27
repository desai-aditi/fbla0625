import { Redirect, Stack } from 'expo-router';
import "../../global.css";

export default function AuthLayout() {
  const isAuthenticated = /* check for valid auth token/session */;

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Stack />;
}