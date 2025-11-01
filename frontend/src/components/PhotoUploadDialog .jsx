import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";

const PhotoUploadDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((store) => store.auth);

    const dispatch = useDispatch();
    
  const [input, setInput] = useState({
    file: null,
  });
  const [preview, setPreview] = useState(user?.profile?.profilePhoto || null);

  // Handle File Selection
  const handleFileChange = (e) => {
      console.log("Hello");
    //   console.log(e.target.files.[0]);
      

    const selectedFile  = e.target.files?.[0];

    if (selectedFile ) {
      setInput({...input,file : selectedFile} );
      setPreview(URL.createObjectURL(selectedFile ));
      
    }
  };

  // Upload Handler
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!input.file) {
      toast.error("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", input.file);

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/photo`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Profile photo updated successfully!");
        setOpen(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to upload image!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Profile Photo</DialogTitle>
          <DialogDescription>
            Upload a new profile picture to refresh your appearance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpload} className="flex flex-col items-center gap-4 py-4">
          {/* Preview Image */}
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="h-28 w-28 rounded-full object-cover border"
            />
          ) : (
            <div className="h-28 w-28 rounded-full flex items-center justify-center bg-gray-200 text-gray-600">
              No Image
            </div>
          )}

          {/* File Input */}
          <div className="w-full">
            <Label>Choose Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>

          <DialogFooter className="w-full">
            {loading ? (
              <Button className="w-full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Upload
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoUploadDialog;
