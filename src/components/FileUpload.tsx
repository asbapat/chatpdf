"use client"
import { uploadToS3 } from '@/lib/s3'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Inbox, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'

const FileUpload = () => {
    const router = useRouter()
    const [uploading, setUploading] = useState<boolean>(false)

    const { mutate, isLoading } = useMutation({
      mutationFn: async ({
        file_key,
        file_name,
      }: {
        file_key: string;
        file_name: string;
      }) => {
        const response = await axios.post("/api/create-chat", {
          file_key,
          file_name,
        });
        return response.data;
      },
    });

    const {getRootProps, getInputProps} = useDropzone({accept:{"application/pdf":[".pdf"]},maxFiles:1,onDrop:async (acceptedFiles) => {
        const file = acceptedFiles[0];
        console.log("File...",file)
        if(file.size > 10*1024*1024){
          toast.error("File too large");
          return
        }

        try {
          setUploading(true);
          const data = await uploadToS3(file)
          console.log("aws_resp...",data)
          if (!data?.file_key || !data.file_name) {
            toast.error("Something went wrong");
            return;
          }
          mutate(data, {
            onSuccess: ({ chat_id }) => {
              toast.success("Chat created!");
              router.push(`/chat/${chat_id}`);
            },
            onError: (err) => {
              toast.error("Error creating chat");
              console.error(err);
            },
          });
        } catch (error) {
          console.log("Error.....",error)
        } finally {
          setUploading(false)
        }
    }})
  return (
    <div className="p-2 bg-white rounded-xl shadow-lg shadow-slate-500">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        {uploading || isLoading ? (
          <>
           <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">
              Uploading File....
            </p>
          </>
        ) : (
          <>
            <input {...getInputProps()} />
            <Inbox className="w-10 h-10 text-blue-600" />
            <p className="mt-2 text-sm text-slate-700">Drop PDF Here</p>
          </>
        )}
      </div>
    </div>
  );
}

export default FileUpload