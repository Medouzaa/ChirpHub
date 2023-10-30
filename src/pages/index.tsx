import { SignInButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Loading, LoadingSpinner } from "~/components/loading";

import { type RouterOutputs, api } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function CreatePost() {
  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
  });

  const { user } = useUser();

  if (!user) return <div>Something went wrong!</div>;

  return (
    <>
      <Image
        src={user.imageUrl}
        alt={`${user.fullName}'s profile picture`}
        className="rounded-full"
        width={56}
        height={56}
        priority={true}
      />
      <input
        type="text"
        placeholder="What is happening?!"
        className="w-full bg-transparent outline-none"
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            console.log("Enter clicked");
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
        value={input}
      />
      {input !== "" && !isPosting && (
        <button onClick={() => mutate({ content: input })} disabled={isPosting}>
          Post
        </button>
      )}
      {isPosting && <LoadingSpinner size={20} />}
    </>
  );
}

type PostWithAuthor = RouterOutputs["posts"]["getAll"][number];

function PostView(props: PostWithAuthor) {
  const { post, author } = props;

  return (
    <div className="flex items-center gap-3 border-b p-4">
      <Image
        src={author.imageUrl}
        alt={`${author.firstName}'s profile picture`}
        className="rounded-full"
        width={56}
        height={56}
        priority={true}
      />
      <div className="flex flex-col">
        <div className="text-sm font-semibold text-slate-300">
          <span>{`@${author.firstName}`}</span> ·{" "}
          <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
        </div>
        <span className="text-lg">{post.content}</span>
      </div>
    </div>
  );
}

function Feed() {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <Loading />;

  if (!data) return <div>Something went wrong!</div>;

  return (
    <div>
      {data.map((postWithAuthor) => (
        <PostView {...postWithAuthor} key={postWithAuthor.post.id} />
      ))}
    </div>
  );
}

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <>
      <Head>
        <title>chirp hub</title>
        <meta name="description" content="chirp hub home page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mx-auto min-h-screen border-x border-slate-400 md:max-w-2xl">
        <div className="flex items-center gap-3 border-b p-4">
          {isSignedIn && <CreatePost />}
          {!isSignedIn && <SignInButton />}
        </div>
        <Feed />
      </div>
    </>
  );
}
