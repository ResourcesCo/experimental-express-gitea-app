import { useRouter } from 'next/router';
import dynamic from 'next/dynamic'

const CodeEditor = dynamic(() => import('../../../src/components/controls/code-editor'), {
  ssr: false,
});
const Editor = dynamic(() => import('../../../src/components/controls/editor'), {
  ssr: false,
});


const IndexPage = () => {
  const router = useRouter();
  const {username, project} = router.query;
  return <div>
    <h1>{username} / {project}</h1>
    <div>
      <CodeEditor value="" />
    </div>
    <div>
      <Editor />
    </div>
  </div>
};

export default IndexPage;
