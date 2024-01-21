import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import useAuth from "@/hooks/use-auth";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema } from "@/validations/validations";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "./icons";
import loginService from "@/services/loginService";

type FormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [err, setErr] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { auth, setAuth } = useAuth();
  const user = auth?.user;

  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const handleOnSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setErr("");
    try {
      const { token, details } = await loginService.login(data);
      setIsLoading(false);
      setAuth({ user: details, token });
      navigate("/");
    } catch (err: any) {
      if (!err?.response) {
        setErr("An error occurred on the server. Please try again later");
        setIsLoading(false);
      } else {
        const errorMsg = err.response?.data?.msg;
        setErr(errorMsg);
        setIsLoading(false);
      }
    }
  };

  // asd
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <section className="section lg:mt-28">
      <div className="w-full max-w-md mx-auto p-4 rounded-lg border bg-container flex flex-col items-center justify-center">
        <Icons.note className="w-8 h-8" />
        <h2 className="text-3xl py-2 font-medium">Notes App</h2>
        <p className="text-center text-card-foreground w-10/12 mx-auto">
          Log in to access your personalized notes and stay organized
          effortlessly.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleOnSubmit)}
            className="relative w-full py-6 flex flex-col gap-2 max-w-xs"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="usertest" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {err && <p className="text-red-600 text-sm self-start">{err}</p>}
            <Button disabled={isLoading}>
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.login className="mr-2 h-[14px] w-[14px]" />
              )}
              Sign In
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default Login;
