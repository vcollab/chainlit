// @ts-expect-error — no types for the slim bundle
import Plotly from 'plotly.js-basic-dist-min';
import { useEffect, useState } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';

import TextViewer from './TextViewer';

const Plot = createPlotlyComponent(Plotly);

export default function ChartViewer({
  textContent,
  viewMode
}: {
  textContent: string | null;
  viewMode: 'preview' | 'raw';
}) {
  const [plotlySpec, setPlotlySpec] = useState<{
    data: Plotly.Data[];
    layout: Partial<Plotly.Layout>;
  } | null>(null);

  useEffect(() => {
    if (textContent) {
      try {
        const parsed = JSON.parse(textContent);
        setPlotlySpec({
          data: parsed.data ?? [],
          layout: parsed.layout ?? {}
        });
      } catch (error) {
        console.error(String(error));
      }
    }
  }, [textContent]);

  if (!textContent) return null;

  if (!plotlySpec) {
    return <TextViewer textContent={textContent || 'Failed to load file.'} />;
  }

  return viewMode === 'preview' ? (
    <Plot
      data={plotlySpec?.data}
      layout={{ autosize: true, ...plotlySpec.layout }}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
    />
  ) : (
    <TextViewer textContent={textContent || 'Failed to load file.'} />
  );
}
