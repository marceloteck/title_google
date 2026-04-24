<?php
declare(strict_types=1);
?><!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gerador de Copy para Google Ads Display</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <div class="bg-orb orb-1" aria-hidden="true"></div>
  <div class="bg-orb orb-2" aria-hidden="true"></div>

  <main class="container">
    <header class="hero card">
      <h1>Gerador de Copy para Google Ads Display</h1>
      <p>Crie títulos e descrições estratégicas para anúncios com mais clareza, segurança e conversão.</p>
    </header>

    <section class="card">
      <form id="copyForm" novalidate>
        <div class="form-section">
          <h2>Dados principais</h2>
          <div class="grid grid-2">
            <label>Nome do produto ou curso
              <input type="text" id="produto" name="produto" placeholder="Ex.: Parto Mais Fácil" required>
            </label>
            <label>Nicho
              <input type="text" id="nicho" name="nicho" placeholder="Ex.: preparação para parto">
            </label>
            <label>Público-alvo
              <input type="text" id="publico" name="publico" placeholder="Ex.: gestantes">
            </label>
            <label>Benefício principal
              <input type="text" id="beneficio" name="beneficio" placeholder="Ex.: preparação para um parto mais tranquilo" required>
            </label>
            <label>Problema que o produto ajuda a resolver
              <input type="text" id="problema" name="problema" placeholder="Ex.: insegurança no momento do parto">
            </label>
            <label>Resultado desejado
              <input type="text" id="resultado" name="resultado" placeholder="Ex.: mais segurança e clareza">
            </label>
            <label>Tempo estimado, se houver
              <input type="text" id="tempo" name="tempo" placeholder="Ex.: 30 dias">
            </label>
            <label>Preço à vista
              <input type="text" id="precoVista" name="precoVista" placeholder="Ex.: R$197">
            </label>
            <label>Preço parcelado
              <input type="text" id="precoParcelado" name="precoParcelado" placeholder="Ex.: R$19,70">
            </label>
            <label>Número de parcelas
              <input type="number" id="parcelas" name="parcelas" min="1" placeholder="Ex.: 12">
            </label>
            <label>Garantia
              <input type="text" id="garantia" name="garantia" placeholder="Ex.: 7 dias">
            </label>
            <label>Bônus, se houver
              <input type="text" id="bonus" name="bonus" placeholder="Ex.: Aula extra de preparação mental">
            </label>
            <label class="full">Link da página oficial
              <input type="url" id="link" name="link" placeholder="https://...">
            </label>
          </div>
        </div>

        <div class="form-section">
          <h2>Configuração da copy</h2>
          <div class="grid grid-2">
            <label>Tom da copy
              <select id="tom" name="tom">
                <option>Neutro</option>
                <option>Emocional</option>
                <option>Urgente</option>
                <option>Autoridade</option>
                <option>Direto</option>
              </select>
            </label>
            <label>Categoria preferida
              <select id="categoria" name="categoria">
                <option>Todas</option>
                <option>Atração e Curiosidade</option>
                <option>Urgência e Escassez</option>
                <option>Autoridade e Prova Social</option>
                <option>Benefícios Diretos</option>
                <option>Transformação e Resultados</option>
              </select>
            </label>
          </div>
        </div>

        <div class="form-section">
          <h2>Segurança para políticas</h2>
          <div class="checkbox-grid">
            <label><input type="checkbox" id="sensivel"> Produto envolve saúde, corpo, gravidez, finanças ou promessa de renda?</label>
            <label><input type="checkbox" id="evitarDireto"> Evitar falar diretamente com o usuário</label>
            <label><input type="checkbox" id="evitarPromessa"> Evitar promessa garantida</label>
            <label><input type="checkbox" id="evitarUrgencia"> Evitar urgência agressiva</label>
            <label><input type="checkbox" id="modoSeguro"> Gerar versões mais seguras para Google Ads</label>
          </div>
        </div>

        <p class="feedback" id="feedback" role="alert" aria-live="polite"></p>

        <div class="actions">
          <button type="submit" class="btn btn-primary">Gerar anúncios</button>
          <button type="button" class="btn" id="btnClear">Limpar campos</button>
          <button type="button" class="btn" id="btnCopyAll">Copiar tudo</button>
          <button type="button" class="btn" id="btnCopyTitles">Copiar apenas títulos</button>
          <button type="button" class="btn" id="btnCopyDescriptions">Copiar apenas descrições</button>
          <button type="button" class="btn" id="btnExport">Exportar CSV</button>
        </div>
      </form>
    </section>

    <section class="card results" id="resultsSection">
      <div class="results-head">
        <h2>Resultados</h2>
        <div class="totals" id="totals"></div>
      </div>

      <div class="filter-bar">
        <label>Filtrar por categoria
          <select id="filterCategory"></select>
        </label>
        <label>Filtrar por tipo
          <select id="filterType"></select>
        </label>
        <label>Filtrar por status
          <select id="filterStatus"></select>
        </label>
      </div>

      <div class="table-wrap">
        <table id="resultsTable" aria-label="Tabela de copies geradas">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Tipo</th>
              <th>Copy gerada</th>
              <th>Caracteres</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </section>
  </main>

  <script src="assets/js/app.js"></script>
</body>
</html>
