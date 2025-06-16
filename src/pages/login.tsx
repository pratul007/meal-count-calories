/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnackbar } from "../component/SnackbarContext";
import RegisterForm from "./register";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import Loader from "@/component/loader";
import { login, register } from "@/component/auth";
import { Controller } from "react-hook-form";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function SignInCard() {
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isRegister = location.pathname === "/register";

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onTouched",
  });

  const handleRegister = async (values: any) => {
    try {
      setLoading(true);
      const data = await register({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email,
        password: values.password,
      });
      showSnackbar(data.message);
      navigate("/login");
    } catch (err) {
      if (err instanceof Error) {
        showSnackbar(err.message, "error");
      } else {
        showSnackbar("Registration failed", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: LoginValues) => {
    try {
      setLoading(true);
      const data = await login(values.email, values.password);

      localStorage.setItem("token", data.token);
      if (values.rememberMe) {
        localStorage.setItem("rememberedEmail", values.email);
      }

      showSnackbar("Login successful!");
      navigate(`/dashboard/${encodeURIComponent(values.email)}`);
    } catch (err) {
      if (err instanceof Error) {
        showSnackbar(err.message, "error");
      } else {
        showSnackbar("Login failed", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    navigate(isRegister ? "/login" : "/register");
  };

  return (
    <>
      {loading && <Loader />}
      <Card className="w-[400px] mx-auto p-6 shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-semibold">
            {isRegister ? "Register" : "Sign in"}
          </h2>
        </CardHeader>
        <CardContent>
          {isRegister ? (
            <RegisterForm onSubmit={handleRegister} />
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
              noValidate
            >
              <div className="text-left space-y-1">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  {...formRegister("email")}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="text-left space-y-1">
                <Label htmlFor="password">Password*</Label>
                <Input
                  id="password"
                  type="password"
                  {...formRegister("password")}
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="rememberMe"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                      <Label htmlFor="rememberMe" className="text-sm">
                        Remember me
                      </Label>
                    </div>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </form>
          )}

          <Separator className="my-4" />

          <div className="text-center text-sm space-y-2">
            <p>
              {isRegister
                ? "Already have an account? "
                : "Don't have an account? "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-600 underline hover:text-blue-800"
              >
                {isRegister ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
