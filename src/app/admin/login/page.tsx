import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4 font-noto-thai">
      <Card className="w-full max-w-md shadow-lg border-gray-100">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-[#1B5E20]">
            NPU Admin Portal
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            กรุณาเข้าสู่ระบบด้วยอีเมลผู้ดูแลระบบ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">อีเมล (Email)</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@npu.ac.th"
              className="focus-visible:ring-[#1B5E20]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">รหัสผ่าน (Password)</Label>
            <Input
              id="password"
              type="password"
              className="focus-visible:ring-[#1B5E20]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-[#1B5E20] hover:bg-[#154a19] text-white">
            เข้าสู่ระบบ
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
