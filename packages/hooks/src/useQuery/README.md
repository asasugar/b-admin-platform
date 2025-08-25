# useQuery

## useQuery （获取query的某个值，或者整个query）

### 示例

``` javascript
import useQuery from '@/hooks/useQuery';

function Demo() => {
  const type = useQuery('type'); // 获取某个query的值
  const query = useQuery(); // 整个query作为一个对象

  return <Space>
    { type } { query}
  </Space>
}

export default Demo;
```
