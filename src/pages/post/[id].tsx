import Head from "next/head";
import { useRouter } from "next/router";
import { Layout } from "~/components/layout";
import { Loading } from "~/components/loading";
import { PostView } from "~/components/post-view";
import { api } from "~/utils/api";

export default function PostPage() {
  const router = useRouter();
  const postId = router.query.id as string;
  const { data: postWithAuthor, isLoading } = api.posts.getPostById.useQuery({
    id: Number(postId),
  });
  console.log("post", postWithAuthor);

  if (isLoading) return <Loading />;

  if (!postWithAuthor) return <div>Something went wrong...</div>;

  return (
    <>
      <Head>
        <title>{postWithAuthor.post.id}</title>
      </Head>
      <Layout>
        <PostView {...postWithAuthor} />
      </Layout>
    </>
  );
}
