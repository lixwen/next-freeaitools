'use client';

import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import Fab from '@mui/material/Fab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const SettingsButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [accountId, setAccountId] = useState("");
  const [apiKey, setApiKey] = useState("");

  // 在组件挂载后读取 localStorage
  useEffect(() => {
    // 检查是否在浏览器环境
    if (typeof window !== 'undefined') {
      setAccountId(localStorage.getItem("cf_account_id") || "");
      setApiKey(localStorage.getItem("cf_api_key") || "");
    }
  }, []);

  const handleSave = () => {
    // 检查是否在浏览器环境
    if (typeof window !== 'undefined') {
      localStorage.setItem("cf_account_id", accountId);
      localStorage.setItem("cf_api_key", apiKey);
    }
    setIsOpen(false);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="settings"
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
        }}
      >
        <Settings />
      </Fab>

      <Dialog 
        open={isOpen} 
        onClose={() => setIsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Your Cloudflare Settings</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Account ID"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            margin="normal"
            type="password"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SettingsButton;