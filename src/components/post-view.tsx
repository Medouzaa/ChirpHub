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
    <div className="flex items-center gap-3 border-b p-4">
      <Image
        src={author.imageUrl}
        alt={`${author.username}'s profile picture`}
        className="rounded-full"
        width={56}
        height={56}
        priority={true}
      />
      <div className="flex flex-col">
        <div className="text-sm font-semibold text-slate-300">
          <Link href={`/${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>{" "}
          · <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
        </div>
        <span className="text-lg">{post.content}</span>
      </div>
    </div>
  );
}
