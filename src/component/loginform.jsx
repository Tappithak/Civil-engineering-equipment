import React, { useState } from "react";
import Button_sign from "./button_sign";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import axios from "axios";
import Swal from 'sweetalert2'

const LoginForm = () => {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      username: username,
      password: password,
    };
    axios
      .post("/api/login", data)
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "เข้าสู่ระบบสำเร็จ",
            showConfirmButton: false,
            timer: 1500
          });
          window.location.href = "/";
        }
      })
      .catch((err) => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "ไม่พบข้อมูลผู้ใช้งาน!",
        });
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 flex flex-col gap-6 justify-centet"
    >
      <Box>
        <FormControl sx={{ width: "100%" }}>
          <OutlinedInput
            className="w-full"
            placeholder="Username"
            startAdornment={
              <PersonIcon className="mr-[10px] flex justify-center items-center text-[30px] text-zinc-400" />
            }
            onChange={(e) => setusername(e.target.value)}
            required
            value={username}
          />
        </FormControl>
      </Box>
      <Box>
        <Box className="flex justify-end w-full">
          <Typography
            className="text-gray-600 hover:cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
            type="button"
          >
            {showPassword ? "🙈 Hide" : "👁️ Show"}
          </Typography>
        </Box>

        <FormControl sx={{ width: "100%" }}>
          <OutlinedInput
            type={showPassword ? "text" : "password"}
            className="w-full"
            placeholder="Password"
            startAdornment={
              <LockIcon className="mr-[10px] flex justify-center items-center text-[30px] text-zinc-400" />
            }
            onChange={(e) => setPassword(e.target.value)}
            required
            value={password}
          />
        </FormControl>
      </Box>
      {
        loading == false &&
      <Button_sign type="submit">Sign in</Button_sign>
    }
      {
        loading == true &&
      <Button_sign type="button">Loading ...</Button_sign>
      }
    </form>
  );
};

export default LoginForm;
