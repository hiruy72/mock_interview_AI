"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials, logout } from "@/redux/features/auth/authSlice";

interface ReduxUserInitializerProps {
  user: User | null;
}

const ReduxUserInitializer = ({ user }: ReduxUserInitializerProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      dispatch(
        setCredentials({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          },
        })
      );
    } else {
      dispatch(logout());
    }
  }, [user, dispatch]);

  return null;
};

export default ReduxUserInitializer;