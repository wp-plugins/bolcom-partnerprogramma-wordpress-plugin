<?php
/**
 * Renders the pager used in the product results
 *
 * This file is part of the Bol-Partner-Plugin for Wordpress.
 *
 * (c) Netvlies Internetdiensten
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace BolPartnerPlugin\Widgets\Renderer;

class PagerRenderer
{
    protected $pages;

    protected $page;

    protected $maxPages = 5;

    public function __construct($pages = null, $page = null)
    {
        if (! is_null($pages)) {
            $this->setPages($pages);
        }

        if (! is_null($page)) {
            $this->setPage($page);
        }
    }

    public function render()
    {
        $html = '';
        if ($this->page > 1) {
            $html .= $this->renderPagerPage($this->page - 1, '&lt;');
        }

        $halfLimit = floor($this->maxPages / 2);

        $start = $this->page - $halfLimit > 0 ? $this->page - $halfLimit : 1;
        $end   = $this->page + $halfLimit < $this->pages ? $this->page + $halfLimit : $this->pages;

        if ($start > 1) {
            $html .= $this->renderPagerPage(1, '1') . '...';
        }

        for ($i = $start; $i <= $end; ++$i) {
            $html .= $this->renderPagerPage($i, $i);
        }

        if ($end < $this->pages) {
            $html .= '...' . $this->renderPagerPage($this->pages, $this->pages);
        }

        if ($this->page < $this->pages) {
            $html .= $this->renderPagerPage($this->page + 1, '&gt;');
        }

        return '<div class="pager">' . $html . '</div>';
    }

    public function __toString()
    {
        return $this->render();
    }

    public function setPage($page)
    {
        $this->page = $page;
        return $this;
    }

    public function setPages($pages)
    {
        $this->pages = $pages;
        return $this;
    }

    public function renderPagerPage($page, $content)
    {
        $class = $this->page == $page ? 'currentPagerLink' : 'pagerLink';
        return sprintf($this->getPageHtml(), $page, $class, $content);
    }

    public function getPageHtml()
    {
        return '<a href="#%d" class="%s">%s</a>';
    }
}
