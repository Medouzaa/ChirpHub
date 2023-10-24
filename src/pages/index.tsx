import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Loading } from "~/components/loading";

import { type RouterOutputs, api } from "~/utils/api";

function CreatePost() {
  const [content, setContent] = useState("");
  const { mutate } = api.posts.create.useMutation();
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
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          mutate({ content, authorId: user.id });
          setContent("");
        }}
      >
        Post
      </button>
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
          <span>{`@${author.firstName}`}</span> · <span>1 hour ago</span>
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
      <SignOutButton />
    </>
  );
}
