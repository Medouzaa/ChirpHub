import { type RouterOutputs } from "~/utils/api";
import Link from "next/link";
import Image from "next/image";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type PostWithAuthor = RouterOutputs["posts"]["getAll"][number];

export function PostView(props: PostWithAuthor) {
  const { post, author } = props;

  return (
    <div className="flex items-start gap-3 border-b p-4">
      <Image
        src={author.imageUrl}
        alt={`${author.username}'s profile picture`}
        className="rounded-full"
        width={48}
        height={48}
        priority={true}
      />
      <div className="flex flex-col">
        <div className="text-sm font-semibold text-slate-300">
          <Link href={`/${author.username}`}>
            <span className="text-base font-bold">{author.username}</span>
          </Link>{" "}
          <span className="font-thin">· {dayjs(post.createdAt).fromNow()}</span>
        </div>
        <Link href={`/post/${post.id.toString()}`}>
          <span className="tracking-tighter">{post.content}</span>
        </Link>
      </div>
    </div>
  );
}
