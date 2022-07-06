import React from 'react';
import { Pie } from '@ant-design/plots';
import type { Datum } from '@ant-design/charts';

type PieDataType = {
  type: string;
  value: number;
};

const OnlineRatePie: React.FC<{
  value: { online: number; offline: number; notRegister: number };
}> = ({ value: { online, offline, notRegister } }) => {
  const data: PieDataType[] = [
    { type: t('Online'), value: online },
    { type: t('Offline'), value: offline },
    { type: t('Not connected'), value: notRegister },
  ];
  const config: any = {
    data,
    legend: {
      offsetX: 40,
      position: 'left',
      marker: {
        symbol: 'square',
      },
      itemName: {
        style: {
          fill: '#ffffff',
        },
      },
    },
    animation: false,
    appendPadding: 10,
    angleField: 'value',
    colorField: 'type',
    color: ['#2BFFFF', '#FF9E17', '#52C0FF'],
    radius: 1,
    innerRadius: 0.5,
    label: {
      type: 'inner',
      offset: '-50%',
      autoRotate: false,
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 12,
      },
    },
    statistic: {
      title: {
        style: { color: '#fff', fontSize: '12px' },
        customHtml: (container: HTMLElement, view: unknown, datum?: Datum) => {
          const text = datum ? datum.type : t('Total');
          return text;
        },
      },
      content: {
        offsetY: 4,
        style: { color: '#fff', fontSize: '14px' },
        customHtml: (container: HTMLElement, view: unknown, datum?: Datum) => {
          const text = datum ? datum.value : data.reduce((r, d) => r + d.value, 0);
          return text;
        },
      },
    },
    interactions: [
      { type: 'element-selected' },
      { type: 'element-active' },
      { type: 'pie-statistic-active' },
    ],
  };
  return <Pie {...config} />;
};

export default OnlineRatePie;
